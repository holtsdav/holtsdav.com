import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import path from 'node:path';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.PORTFOLIO_PREVIEW_URL||'http://127.0.0.1:4327';
assert.ok(['localhost','127.0.0.1'].includes(new URL(base).hostname));
const out=path.resolve('docs/review-2026-10-20/design-revision-20261020');
const browser=await chromium.launch({headless:true,executablePath:process.env.PORTFOLIO_CHROMIUM_PATH});
const results=[];const samples=[];
try{
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'no-preference'});
  await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.waitForFunction(()=>document.querySelector('[data-name-reveal]').dataset.namePhase==='joined');
  assert.equal(await page.locator('h1').getAttribute('aria-label'),'David Holtschke — holtsdav');
  await page.getByRole('button',{name:'Replay name'}).click();
  await page.waitForFunction(()=>document.querySelector('[data-name-reveal]').dataset.namePhase==='move');
  for(let i=0;i<20;i++){
   const state=await page.evaluate(()=>({phase:document.querySelector('[data-name-reveal]').dataset.namePhase,rects:[...document.querySelectorAll('[data-name-mover]')].map(el=>{const range=document.createRange();range.selectNodeContents(el);const r=range.getBoundingClientRect();return {key:el.dataset.nameMover,left:r.left,top:r.top,right:r.right,bottom:r.bottom}}),width:innerWidth}));
   samples.push({width,...state});
   if(state.phase==='move'){for(const r of state.rects){assert.ok(r.left>=-1&&r.right<=width+1&&r.top>=0,JSON.stringify(state));}const[a,b]=state.rects;assert.ok(!(a.left<b.right-3&&a.right>b.left+3&&a.top<b.bottom-3&&a.bottom>b.top+3),JSON.stringify(state));}
   await page.waitForTimeout(55);
  }
  await page.waitForFunction(()=>document.querySelector('[data-name-reveal]').dataset.namePhase==='joined');
  assert.equal(await page.locator('[data-replay-name]').isEnabled(),true);
  await page.getByRole('button',{name:'Replay name'}).click();await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>document.querySelector('[data-name-reveal]').dataset.namePhase==='static');
  assert.equal(await page.locator('[data-replay-name]').isVisible(),false);
  assert.equal(await page.locator('.name-source').evaluate(el=>getComputedStyle(el).opacity),'1');
  assert.equal(await page.evaluate(()=>document.getAnimations().length),0);
  await page.screenshot({path:path.join(out,`name-reduced-${width}.png`)});
  await page.emulateMedia({reducedMotion:'no-preference'});await page.getByRole('button',{name:'Replay name'}).click();
  await page.waitForFunction(()=>document.querySelector('[data-name-reveal]').dataset.namePhase==='extract');await page.setViewportSize({width:width+5,height:1000});
  await page.waitForFunction(()=>document.querySelector('[data-name-reveal]').dataset.namePhase==='joined');
  assert.deepEqual(errors,[]);results.push({width,passed:true,checks:['replay','actual moving text bounds and separation','screen-reader name','live reduced-motion preference','resize interruption','no JavaScript errors']});await context.close();
 }
}finally{await writeFile(path.join(out,'name-animation-qa.json'),JSON.stringify({base,date:new Date().toISOString(),results,samples},null,2)+'\n');await browser.close();}
console.log('PASS animation replay, actual movement, reduced motion and resize at 320/390/768/1440');
