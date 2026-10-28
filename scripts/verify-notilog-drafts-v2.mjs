import assert from 'node:assert/strict';
import { mkdir,writeFile } from 'node:fs/promises';
import path from 'node:path';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.PORTFOLIO_PREVIEW_URL||'http://127.0.0.1:4327';
assert.ok(['127.0.0.1','localhost'].includes(new URL(base).hostname));
const out=path.resolve('docs/review-2026-10-20/design-revision-20261020');await mkdir(path.join(out,'screenshots'),{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.PORTFOLIO_CHROMIUM_PATH?{executablePath:process.env.PORTFOLIO_CHROMIUM_PATH}:{})});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
await context.route('**/*',route=>['localhost','127.0.0.1'].includes(new URL(route.request().url()).hostname)?route.continue():route.abort());
const page=await context.newPage(),errors=[],results=[];page.on('pageerror',e=>errors.push(e.message));
async function check(name,fn){await fn();results.push({name,passed:true});console.log('PASS '+name)}
async function visit(route){const r=await page.goto(base+route,{waitUntil:'networkidle'});assert.equal(r.status(),200,route)}
try{
  for(const [route,name] of [['/support/notilog/','notilog-support'],['/drafts/notilog-privacy/','notilog-privacy-draft']]){
    await check(name+': draft markers, semantics, privacy and links',async()=>{
      await visit(route);
      assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('main').count(),1);
      assert.equal(await page.locator('html').getAttribute('lang'),'en');
      assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex, nofollow');
      assert.equal(await page.locator('link[rel="canonical"]').count(),0);
      assert.equal(await page.getByText('Local draft · Not published',{exact:true}).count(),1);
      assert.equal(await page.locator('[aria-labelledby]').evaluateAll(els=>els.filter(el=>el.getAttribute('aria-labelledby').split(/\s+/).some(id=>!document.getElementById(id))).length),0);
      const content=await page.locator('.draft-document').textContent();assert.ok(!content.includes('/Users/'));assert.ok(!content.includes('TURNSTILE_SECRET'));
      const ids=await page.locator('[id]').evaluateAll(els=>els.map(el=>el.id));assert.equal(new Set(ids).size,ids.length);
      for(const href of await page.locator('.draft-document a').evaluateAll(els=>els.map(el=>el.getAttribute('href')))){
        assert.ok(href);
        if(href.startsWith('#'))assert.equal(await page.locator(`[id="${href.slice(1)}"]`).count(),1,href);
        else if(href.startsWith('/'))assert.equal((await context.request.get(base+href)).status(),200,href);
        else if(href.startsWith('mailto:'))assert.ok(href.startsWith('mailto:contact@holtsdav.com?'));
        else assert.equal(new URL(href).protocol,'https:');
      }
      assert.equal(await page.locator('.draft-document a[target="_blank"]:not([rel~="noreferrer"])').count(),0);
    });
    await check(name+': responsive text bounds at 320, 390, 621, 768, 1024 and 1440 px',async()=>{
      for(const width of [320,390,621,768,1024,1440]){
        await page.setViewportSize({width,height:1000});
        const outside=await page.locator('.draft-document h1,.draft-document h2,.draft-document a,.draft-notice,.draft-review-point').evaluateAll(els=>els.filter(el=>{const r=el.getBoundingClientRect();return r.left< -1||r.right>innerWidth+1}).map(el=>el.textContent.slice(0,60)));
        assert.deepEqual(outside,[],`${width}: ${JSON.stringify(outside)}`);
      }
    });
    await check(name+': text contrast',async()=>{
      const failures=await page.evaluate(()=>{
        const parse=v=>{const a=v.match(/[\d.]+/g)?.map(Number)??[0,0,0,1];return [...a.slice(0,3),a[3]??1]};
        const over=(a,b)=>[...a.slice(0,3).map((v,i)=>v*a[3]+b[i]*(1-a[3])),1];
        const lum=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
        const walker=document.createTreeWalker(document.querySelector('.draft-document'),NodeFilter.SHOW_TEXT),bad=[];
        for(let n=walker.nextNode();n;n=walker.nextNode()){
          const el=n.parentElement;if(!n.textContent.trim()||!el.getClientRects().length)continue;
          const s=getComputedStyle(el);if(s.visibility!=='visible')continue;
          const ancestors=[];for(let p=el;p;p=p.parentElement)ancestors.unshift(p);
          let bg=[255,255,255,1];for(const p of ancestors)bg=over(parse(getComputedStyle(p).backgroundColor),bg);
          const a=lum(over(parse(s.color),bg)),b=lum(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05),size=parseFloat(s.fontSize),min=size>=24||(size>=18.66&&Number(s.fontWeight)>=700)?3:4.5;
          if(ratio<min-.01)bad.push({text:n.textContent.trim().slice(0,50),ratio});
        }return bad;
      });assert.deepEqual(failures,[]);
    });
    await check(name+': keyboard, anchor clearance, no-JavaScript content and screenshots',async()=>{
      await page.setViewportSize({width:390,height:844});await visit(route);
      await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Skip to content');
      await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement.id),'main-content');
      await page.locator('.draft-contents a[href="#retention"]').focus();
      assert.notEqual(await page.locator('.draft-contents a[href="#retention"]').evaluate(el=>getComputedStyle(el).outlineStyle),'none');
      await page.keyboard.press('Enter');
      assert.equal(new URL(page.url()).hash,'#retention');
      const top=await page.locator('#retention h2').evaluate(el=>el.getBoundingClientRect().top);assert.ok(top>=100,`Anchor heading covered: ${top}`);
      assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
      for(const [width,height,view] of [[1440,1000,'desktop'],[390,844,'mobile']]){
        await page.setViewportSize({width,height});await visit(route);await page.mouse.move(0,0);
        await page.screenshot({path:path.join(out,'screenshots',`${view}-${name}.png`),fullPage:true});
      }
      const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),p=await nojs.newPage();
      await p.goto(base+route);assert.ok(await p.locator('.draft-copy section').count()>=7);assert.equal(await p.locator('h1').count(),1);await nojs.close();
    });
  }
  await check('No JavaScript exceptions',async()=>assert.deepEqual(errors,[]));
}finally{await writeFile(path.join(out,'notilog-draft-qa.json'),JSON.stringify({base,date:new Date().toISOString(),results,errors},null,2)+'\n');await browser.close()}
