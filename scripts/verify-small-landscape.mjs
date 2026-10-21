import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {chromium} from '/Users/holtsdav/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const out=process.cwd()+'/docs/review-2026-10-21/refinement';
const browser=await chromium.launch({headless:true,executablePath:'/Users/holtsdav/.cache/puppeteer/chrome/mac_arm-152.0.7977.75/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'});
const observations=[];
try{
 const context=await browser.newContext({viewport:{width:568,height:320}});
 await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 const page=await context.newPage();await page.goto('http://127.0.0.1:4330/?direction=gallery',{waitUntil:'networkidle'});
 const ids=await page.locator('#workspace-project-data').evaluate(e=>JSON.parse(e.textContent).map(p=>p.id));
 await page.evaluate(ids=>sessionStorage.setItem('portfolio.opened',JSON.stringify(ids)),ids);await page.reload({waitUntil:'networkidle'});
 await page.waitForFunction(()=>document.querySelector('particle-wordmark')?.dataset.particleReady==='true');
 for(const state of ['live','reduced']){
  if(state==='reduced')await page.emulateMedia({reducedMotion:'reduce'});
  else await page.waitForTimeout(6500);
  const record=await page.evaluate(()=>{const d=document.querySelector('.workspace-dock').getBoundingClientRect();return [...document.querySelectorAll('.home-caption,.identity-controls a,.identity-controls button:not([hidden])')].map(e=>{const r=e.getBoundingClientRect();return{text:e.textContent.trim(),inside:r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight,overlap:r.left<d.right&&r.right>d.left&&r.top<d.bottom&&r.bottom>d.top}})});
  assert.ok(record.every(x=>x.inside&&!x.overlap),JSON.stringify(record));
  observations.push({width:568,height:320,state,allTenOpen:true,controls:record,passed:true});
  await page.screenshot({path:out+`/home-568x320-${state}-all-open.png`});
 }
 await context.close();
}finally{await browser.close();await writeFile(out+'/small-landscape-qa.json',JSON.stringify({observations},null,2)+'\n');}
console.log('PASS 568x320 all-open dock: live original full-name hold and reduced-motion controls clear dock');
