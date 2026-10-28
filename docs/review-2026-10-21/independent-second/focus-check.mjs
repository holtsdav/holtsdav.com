import { chromium } from '/Users/holtsdav/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
const out=process.env.INDEPENDENT_REVIEW_OUTPUT||'/Users/holtsdav/Documents/Codex/2026-10-20/task-2/holtsdav-portfolio-workspace/docs/review-2026-10-21/independent-second';await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/Users/holtsdav/.cache/puppeteer/chrome/mac_arm-152.0.7977.75/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'});
const report=[];
try{
 for(const width of[320,390,1440]){
 const context=await browser.newContext({viewport:{width,height:844},reducedMotion:'reduce'});await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());const page=await context.newPage();await page.goto('http://127.0.0.1:4330/');await page.evaluate(()=>sessionStorage.setItem('portfolio.opened',JSON.stringify(JSON.parse(document.getElementById('workspace-project-data').textContent).map(p=>p.id))));await page.goto('http://127.0.0.1:4330/projects/notilog/');await page.locator('.dock-home').focus();await page.keyboard.press('Tab');
 for(let i=0;i<20;i++){
 if(i)await page.keyboard.press('Tab');await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 const state=await page.evaluate(()=>{const e=document.activeElement;const strip=e.closest('.dock-opened');const r=e.getBoundingClientRect();const style=getComputedStyle(e),spread=parseFloat(style.outlineWidth)+parseFloat(style.outlineOffset);const s=strip?.getBoundingClientRect();const more=document.querySelector('.dock-projects').getBoundingClientRect();return{label:e.getAttribute('aria-label'),inStrip:!!strip,rect:{left:r.left,top:r.top,right:r.right,bottom:r.bottom},strip:s?{left:s.left,top:s.top,right:s.right,bottom:s.bottom}:null,spread,scroll:strip?.scrollLeft,ringClipped:!!s&&(r.left-spread<s.left-.1||r.right+spread>s.right+.1||r.top-spread<s.top-.1||r.bottom+spread>s.bottom+.1),inViewport:r.left>=0&&r.right<=innerWidth,projectsLeft:more.left};});report.push({width,index:i,...state});
 if(i===0||i===6||i===18)await page.screenshot({path:out+`/dock-focus-${width}-${i}.png`});
 }
 await page.locator('.dock-more').click();await page.screenshot({path:out+`/more-${width}.png`});await page.keyboard.press('Escape');await context.close();
 }
}finally{await writeFile(out+'/focused-qa.json',JSON.stringify(report,null,2)+'\n');await browser.close();}
console.log(JSON.stringify({observations:report.length,ringClipped:report.filter(r=>r.ringClipped).map(({width,index,label})=>({width,index,label})),offscreen:report.filter(r=>!r.inViewport).map(({width,index,label})=>({width,index,label}))},null,2));
