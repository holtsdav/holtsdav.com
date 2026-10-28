/** Local browser QA. Uses an already installed Playwright and Chromium. */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.PORTFOLIO_PREVIEW_URL || 'http://127.0.0.1:4326';
assert.ok(['localhost','127.0.0.1'].includes(new URL(base).hostname), 'QA must use a loopback preview');
const output = path.resolve('docs/review-2026-10-20');
await mkdir(path.join(output, 'screenshots'), { recursive: true });
const results = [];
const browser = await chromium.launch({headless:true, ...(process.env.PORTFOLIO_CHROMIUM_PATH ? {executablePath:process.env.PORTFOLIO_CHROMIUM_PATH} : {})});
const context = await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']});
const page = await context.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
const localRoutes = new Set();
// Keep QA fully local. Outbound links are inspected, not followed. The contact
// form is not submitted and its external challenge is not needed for these checks.
await context.route('**/*', route => {
  const url = new URL(route.request().url());
  return ['127.0.0.1','localhost'].includes(url.hostname) || ['data:','blob:'].includes(url.protocol) ? route.continue() : route.abort();
});
async function check(name, fn) { await fn(); results.push({name,passed:true}); console.log(`PASS ${name}`); }
async function visit(url='/') { const response=await page.goto(base+url,{waitUntil:'networkidle'}); assert.equal(response.status(),200,url); }
try {
  await check('Homepage semantics, still imagery, local links',async()=>{
    await visit();
    assert.equal(await page.locator('h1').count(),1);
    assert.equal(await page.locator('html').getAttribute('lang'),'en');
    assert.equal(await page.locator('main').count(),1);
    assert.equal(await page.locator('[data-project]').count(),3);
    assert.equal(await page.locator('img:not([alt])').count(),0);
    assert.equal(await page.locator('img[src$=".gif"],canvas').count(),0);
    assert.equal(await page.locator('a[target="_blank"]:not([rel~="noreferrer"])').count(),0);
    const hrefs=await page.locator('a').evaluateAll(els=>els.map(el=>el.getAttribute('href')).filter(Boolean));
    for(const href of hrefs){if(href.startsWith('/')&&!href.startsWith('//'))localRoutes.add(href.split('#')[0]);if(href.startsWith('#'))assert.equal(await page.locator(`[id="${href.slice(1)}"]`).count(),1);}
  });
  await check('Responsive painted hero bounds at 320, 390, 620, 621, 700, 701, 768, 800, 801, 900, 901, 1024 and 1440 pixels',async()=>{
    for(const width of [320,390,620,621,700,701,768,800,801,900,901,1024,1440]){
      await page.setViewportSize({width,height:width<600?844:1000});
      const geometry=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,offscreen:[...document.querySelectorAll('.folio h1,.folio h2,.folio-dock,.folio-project,.folio-hero a,.folio-object-stage img,.folio-room-icon,.folio-stage-note,.folio-hero-foot')].filter(el=>!el.hidden).filter(el=>{const r=el.getBoundingClientRect();return r.left < -1 || r.right>innerWidth+1}).map(el=>({class:el.className,left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right}))}));
      assert.ok(geometry.scroll<=geometry.width+1,JSON.stringify(geometry));
      assert.deepEqual(geometry.offscreen,[],JSON.stringify(geometry));
    }
  });
  await check('Project filtering and direct project navigation',async()=>{
    await page.setViewportSize({width:1440,height:1000});
    await page.getByRole('button',{name:'Web tools'}).click();
    assert.equal(await page.locator('[data-project]:visible').count(),1);
    assert.equal(await page.locator('[data-filter-count]').textContent(),'1 project');
    await page.getByRole('button',{name:'Apple apps'}).click();
    assert.equal(await page.locator('[data-project]:visible').count(),2);
    await page.evaluate(()=>{location.hash='room-planner'});
    await page.waitForFunction(()=>!document.getElementById('room-planner').hidden);
    assert.equal(await page.locator('[data-project]:visible').count(),3);
  });
  await check('Dock navigation, active section and reduced motion',async()=>{
    for(const id of ['home','projects','about','contact']){
      await page.locator(`.folio-dock a[href="#${id}"]`).click();
      await page.waitForFunction(id=>document.querySelector('.folio-dock a[aria-current]')?.getAttribute('data-section')===id,id);
      assert.equal(await page.locator('.folio-dock a[aria-current]').count(),1);
    }
    assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
    assert.equal(await page.locator('.folio-app-object').first().evaluate(el=>getComputedStyle(el).animationName),'none');
  });
  await check('Keyboard skip link and visible focus',async()=>{
    await visit();
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(()=>document.activeElement?.textContent),'Skip to content');
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(()=>document.activeElement?.id),'main-content');
    await page.locator('.folio-dock a[href="#projects"]').focus();
    assert.notEqual(await page.locator('.folio-dock a[href="#projects"]').evaluate(el=>getComputedStyle(el).outlineStyle),'none');
    await page.keyboard.press('Enter');
    assert.equal(new URL(page.url()).hash,'#projects');
  });
  await check('Sequential keyboard targets clear the dock at mobile and desktop heights',async()=>{
    const records=[];
    for(const [width,height] of [[390,844],[1440,844]]){
      await page.setViewportSize({width,height});await visit();
      const count=await page.locator('a[href]:visible,button:not([disabled]):visible').count();
      for(let index=0;index<count;index++){
        await page.keyboard.press('Tab');
        await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
        const state=await page.evaluate(()=>{
          const el=document.activeElement,dock=document.querySelector('.folio-dock');
          const r=el.getBoundingClientRect(),d=dock.getBoundingClientRect();
          return {label:el.getAttribute('aria-label')||el.textContent.trim(),href:el.getAttribute('href'),inDock:!!el.closest('.folio-dock'),rect:{left:r.left,right:r.right,top:r.top,bottom:r.bottom},dock:{left:d.left,right:d.right,top:d.top,bottom:d.bottom},overlaps:r.left<d.right&&r.right>d.left&&r.top<d.bottom&&r.bottom>d.top};
        });
        records.push({width,height,index,...state});
        assert.ok(state.inDock||!state.overlaps,JSON.stringify({width,height,index,...state}));
        if(width===390&&state.href==='/apps/mute-on-location/'&&state.label.includes('Explore the app'))await page.screenshot({path:path.join(output,'screenshots','keyboard-mobile-mute.png')});
        if(width===1440&&state.label==='Copy email')await page.screenshot({path:path.join(output,'screenshots','keyboard-desktop-copy.png')});
      }
    }
    await writeFile(path.join(output,'keyboard-clearance.json'),JSON.stringify(records,null,2)+'\n');
  });
  await check('Copy email feedback',async()=>{
    await page.locator('.folio-dock a[href="#contact"]').click();
    await page.locator('[data-copy-email]').click();
    await page.waitForFunction(()=>document.querySelector('[data-copy-status]')?.textContent==='Email copied.');
    assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'contact@holtsdav.com');
  });
  await check('New project pages, privacy and legal links resolve locally',async()=>{
    for(const route of [...localRoutes,'/project/glassdays/','/apps/glassdays-countdown/','/apps/mute-on-location/','/privacy/glassdays/','/impressum/','/privacy/','/contact/']){
      const response=await context.request.get(base+route);assert.equal(response.status(),200,route);
    }
    for(const route of ['/apps/glassdays-countdown/','/project/glassdays/']){
      await visit(route);
      assert.equal(await page.locator('h1').count(),1);
      assert.equal(await page.getByText('More Info coming soon.',{exact:true}).count(),0);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://holtsdav.com/apps/glassdays-countdown/');
      for(const width of [320,390,768,1440]){
        await page.setViewportSize({width,height:width<600?844:1000});
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${route} at ${width}`);
      }
    }
  });
  await check('Public destinations, truthful Mute release copy and legacy aliases',async()=>{
    await visit();
    assert.equal(await page.locator('a[href*="github.com/holtsdav/Glassdays"],a[href*="github.com/holtsdav/MuteOnLocation"]').count(),0);
    await visit('/apps/glassdays-countdown/');
    assert.equal(await page.locator('a[href*="github.com/holtsdav/Glassdays"]').count(),0);
    await visit('/apps/mute-on-location/');
    assert.equal(await page.getByText('Available on the Mac App Store',{exact:true}).count(),1);
    assert.equal(await page.getByText(/not yet available|In development/).count(),0);
    assert.ok(await page.locator('a[href="https://apps.apple.com/de/app/mute-on-location/id6790398791?l=en-GB&mt=12"]').count()>=1);
    const aliases={'/Glassdays/':'/apps/glassdays-countdown/','/MuteOnLocation/':'/apps/mute-on-location/','/RogueColor/':'/apps/rogue-color/','/NotiLog/':'/','/project/mute-on-location/':'/apps/mute-on-location/','/project/rogue-color/':'/apps/rogue-color/','/project/RoomPlanner/':'/apps/room-planner/','/project/notilog/':'/'};
    for(const [alias,destination] of Object.entries(aliases)){
      await visit(alias);await page.waitForURL(base+destination+(alias.toLowerCase().includes('notilog')?'#projects':''));
      assert.equal(await page.locator('h1').count(),1);
      assert.equal(await page.getByText(/More Info coming soon/i).count(),0);
    }
  });
  await check('Images decode and desktop/mobile screenshots',async()=>{
    for(const [name,route,width,height] of [['desktop-home','/',1440,1000],['mobile-home','/',390,844],['desktop-glassdays','/project/glassdays/',1440,1000],['mobile-glassdays','/project/glassdays/',390,844],['mobile-mute','/apps/mute-on-location/',390,844],['home-621','/',621,844],['home-700','/',700,844],['home-701','/',701,844],['home-801','/',801,844]]){
      await page.setViewportSize({width,height});await visit(route);
      await page.evaluate(async()=>{await Promise.all([...document.images].map(img=>{img.loading='eager';return img.decode()}))});
      await page.screenshot({path:path.join(output,'screenshots',`${name}.png`),fullPage:true});
      if(route==='/')await page.screenshot({path:path.join(output,'screenshots',`${name}-viewport.png`)});
    }
  });
  await check('Text contrast on homepage and Glassdays page',async()=>{
    for(const route of ['/','/project/glassdays/']){
      await visit(route);
      const failures=await page.evaluate(()=>{
        const parse=value=>{const c=value.match(/[\d.]+/g)?.map(Number)??[0,0,0,1];return [...c.slice(0,3),c[3]??1]};
        const over=(a,b)=>[...a.slice(0,3).map((v,i)=>v*a[3]+b[i]*(1-a[3])),1];
        const lum=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
        const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const failures=[];
        for(let node=walker.nextNode();node;node=walker.nextNode()){
          const el=node.parentElement,text=node.textContent.trim();
          if(!el||!text||el.closest('script,style,noscript,[aria-hidden="true"],[hidden]')||!el.getClientRects().length)continue;
          const style=getComputedStyle(el);if(style.visibility!=='visible')continue;
          const ancestors=[];for(let p=el;p;p=p.parentElement)ancestors.unshift(p);
          let bg=[255,255,255,1];for(const p of ancestors)bg=over(parse(getComputedStyle(p).backgroundColor),bg);
          const fg=over(parse(style.color),bg),a=lum(fg),b=lum(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
          const size=parseFloat(style.fontSize),large=size>=24||(size>=18.66&&Number(style.fontWeight)>=700),minimum=large?3:4.5;
          if(ratio<minimum-.01)failures.push({text:text.slice(0,70),ratio:Math.round(ratio*100)/100,minimum,color:style.color});
        }
        return failures;
      });
      assert.deepEqual(failures,[],`${route}: ${JSON.stringify(failures)}`);
    }
  });
  await check('Readable portfolio with JavaScript disabled',async()=>{
    const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
    const p=await nojs.newPage();await p.goto(base);
    assert.equal(await p.locator('[data-project]:visible').count(),3);
    assert.equal(await p.locator('.folio-dock a').count(),4);
    assert.equal(await p.locator('[data-project-filters]:visible').count(),0);
    await p.locator('.folio-dock a[href="#about"]').click();
    assert.equal(new URL(p.url()).hash,'#about');
    await p.screenshot({path:path.join(output,'screenshots','mobile-no-javascript.png'),fullPage:true});
    await nojs.close();
  });
  await check('No browser JavaScript exceptions',async()=>assert.deepEqual(errors,[]));
} finally {
  await writeFile(path.join(output,'browser-qa.json'),JSON.stringify({base,date:new Date().toISOString(),results,errors},null,2)+'\n');
  await browser.close();
}
