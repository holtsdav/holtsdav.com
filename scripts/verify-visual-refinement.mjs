import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from '/Users/holtsdav/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const base='http://127.0.0.1:4330',out=process.cwd()+'/docs/review-2026-10-21/refinement';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/Users/holtsdav/.cache/puppeteer/chrome/mac_arm-152.0.7977.75/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'});
const errors=[],folds=[],compact=[];
try{
 const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 for(const [width,height] of [[1440,900],[1440,800],[1440,1000],[1024,768],[768,1024],[768,700],[620,900],[620,844],[620,768],[760,844],[421,844],[390,844],[390,700],[320,568],[844,390],[844,320],[600,390],[1024,500]]){
  await page.setViewportSize({width,height});await page.goto(base+'/?direction=gallery',{waitUntil:'networkidle'});
  const result=await page.evaluate(()=>{const d=document.querySelector('.workspace-dock').getBoundingClientRect(),bad=[],captions=[];
   for(const e of document.querySelectorAll('.home-caption,.identity-controls,.gallery-project>span')){const walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);for(let n=walker.nextNode();n;n=walker.nextNode()){if(!n.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(n);for(const r of range.getClientRects()){const visible=r.bottom>0&&r.top<innerHeight;const text=n.textContent.trim();captions.push({text,top:r.top,bottom:r.bottom,visible});if(visible&&r.left<d.right+8&&r.right>d.left-8&&r.top<d.bottom+8&&r.bottom>d.top-8)bad.push({text,top:r.top,bottom:r.bottom});}}}
   return{bad,captions,dock:{top:d.top,bottom:d.bottom}}});
  folds.push({width,height,...result});
  if([[1440,900],[390,844],[844,390],[844,320],[600,390]].some(([w,h])=>w===width&&h===height))await page.screenshot({path:out+`/home-${width}x${height}.png`});
 }
 await page.setViewportSize({width:1440,height:900});await page.goto(base+'/?direction=gallery',{waitUntil:'networkidle'});
 await page.locator('.dock-projects').click();assert.equal(await page.locator('dialog').isVisible(),true);
 const rows=await page.locator('[data-folder-project]').evaluateAll(es=>new Set(es.map(e=>Math.round(e.getBoundingClientRect().top))).size);assert.equal(rows,3);
 await page.screenshot({path:out+'/projects-folder-desktop-1440x900.png'});await page.keyboard.press('Escape');
 for(const id of ['glassdays','mute-on-location','notilog'])await page.goto(base+'/projects/'+id+'/',{waitUntil:'networkidle'});
 await page.screenshot({path:out+'/notilog-three-open-desktop-1440x900.png'});
 for(const id of ['notilog','saveshelf','reviewbar','auxjam','glassdays-catalog']){
  for(const width of [320,390,1440]){await page.setViewportSize({width,height:width<600?844:900});await page.goto(base+'/projects/'+id+'/',{waitUntil:'networkidle'});
   assert.equal(await page.locator('.project-title>img').count(),1);assert.equal(await page.locator('.project-page>div.project-profile, .project-profile-art, .project-page dl').count(),0);
   assert.equal(await page.locator('article img').count(),1);assert.equal(await page.locator('article h2, article dt').count(),0);
   const size=await page.locator('.project-summary').boundingBox();assert.ok(size.height<200,JSON.stringify({id,width,size}));
   compact.push({id,width,summaryHeight:size.height,passed:true});
   if(id==='notilog'||id==='glassdays-catalog')await page.screenshot({path:out+`/${id}-compact-${width}.png`,fullPage:true});
  }
 }
 assert.deepEqual(errors,[]);
 assert.deepEqual(folds.filter(f=>f.bad.length),[],'Important gallery text intersects the landing dock.');
 console.log('PASS landing caption clearance, three-row desktop folder, all five compact pages and no JS exceptions');
 await context.close();
}finally{await writeFile(out+'/refinement-qa.json',JSON.stringify({date:new Date().toISOString(),folds,compact,errors},null,2)+'\n');await browser.close();}
