import assert from 'node:assert/strict';
import {mkdir,writeFile,readdir,readFile} from 'node:fs/promises';
import path from 'node:path';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'/Users/holtsdav/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const base=process.env.PORTFOLIO_PREVIEW_URL||'http://127.0.0.1:4330';
assert.ok(['127.0.0.1','localhost'].includes(new URL(base).hostname));
const out=path.resolve('docs/review-2026-10-21/qa');await mkdir(out+'/screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.PORTFOLIO_CHROMIUM_PATH||'/Users/holtsdav/.cache/puppeteer/chrome/mac_arm-152.0.7977.75/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'});
const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
await context.route('**/*',r=>['127.0.0.1','localhost'].includes(new URL(r.request().url()).hostname)?r.continue():r.abort());
const page=await context.newPage(),results=[],errors=[],keyboard=[],routes=[],geometry=[];page.on('pageerror',e=>errors.push(e.message));
const check=async(name,fn)=>{await fn();results.push({name,passed:true});console.log('PASS '+name);};
const visit=async(route='/')=>{const response=await page.goto(base+route,{waitUntil:'networkidle'});assert.equal(response.status(),200,route);};
const decode=async()=>{
 const failures=await page.evaluate(async()=>{
  const errors=[];
  await Promise.all([...document.images].map(async img=>{
   try{
    await new Promise((resolve,reject)=>{
     const finish=()=>{clearTimeout(timer);img.removeEventListener('load',loaded);img.removeEventListener('error',failed);};
     const loaded=()=>{finish();img.naturalWidth>0?resolve():reject(new Error('Loaded image has no pixels'));};
     const failed=()=>{finish();reject(new Error('Image request failed'));};
     const timer=setTimeout(()=>{finish();reject(new Error('Image load timed out'));},8000);
     img.addEventListener('load',loaded,{once:true});img.addEventListener('error',failed,{once:true});
     img.loading='eager';
     if(img.complete&&img.naturalWidth>0)loaded();
    });
    await img.decode();
   }catch(error){errors.push({src:img.src,currentSrc:img.currentSrc,complete:img.complete,naturalWidth:img.naturalWidth,error:String(error)});}
  }));
  return errors;
 });
 assert.deepEqual(failures,[],JSON.stringify({url:page.url(),failures}));
};
const shot=async name=>{await decode();await page.screenshot({path:out+'/screenshots/'+name+'.png',fullPage:true});};
let projects;
const allFailures=[];try{
 await check('Text contrast on every project, utility, folder and More',async()=>{for(const route of['/','/?direction=workspace','/?direction=shelf','/projects/glassdays/','/projects/notilog/','/projects/saveshelf/','/projects/mute-on-location/','/projects/reviewbar/','/projects/pdf-editor/','/projects/room-planner/','/projects/auxjam/','/projects/rogue-color/','/projects/glassdays-catalog/','/about/','/support/','/privacy/','/impressum/']){await visit(route);for(const state of['page',...(route==='/'?['folder','more']:[])]){if(state==='folder')await page.locator('.dock-projects').click();if(state==='more')await page.locator('.dock-more').click();const failures=await page.evaluate(()=>{const parse=s=>{const a=s.match(/[\d.]+/g)?.map(Number)||[0,0,0,1];return[...a.slice(0,3),a[3]??1]};const over=(a,b)=>[...a.slice(0,3).map((v,i)=>v*a[3]+b[i]*(1-a[3])),1];const lum=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),bad=[];for(let n=walker.nextNode();n;n=walker.nextNode()){const el=n.parentElement;if(!n.textContent.trim()||!el||el.closest('script,style,[aria-hidden="true"],[hidden]')||!el.getClientRects().length)continue;const cs=getComputedStyle(el);if(cs.visibility!=='visible'||cs.opacity==='0')continue;const ancestors=[];for(let a=el;a;a=a.parentElement)ancestors.unshift(a);if(ancestors.some(a=>getComputedStyle(a).opacity==='0'))continue;let bg=[255,255,255,1];for(const a of ancestors)bg=over(parse(getComputedStyle(a).backgroundColor),bg);const x=lum(over(parse(cs.color),bg)),y=lum(bg),ratio=(Math.max(x,y)+.05)/(Math.min(x,y)+.05),size=parseFloat(cs.fontSize),min=size>=24||(size>=18.66&&Number(cs.fontWeight)>=700)?3:4.5;if(ratio<min-.01)bad.push({text:n.textContent.trim().slice(0,45),ratio,color:cs.color});}return bad;});allFailures.push(...failures.map(f=>({route,state,...f})));if(state!=='page')await page.keyboard.press('Escape');}}});
assert.deepEqual(allFailures,[],JSON.stringify(allFailures));console.log('PASS all readable UI text contrast');}finally{await writeFile(out+'/contrast-qa.json',JSON.stringify({date:new Date().toISOString(),allFailures},null,2)+'\n');await browser.close();}
