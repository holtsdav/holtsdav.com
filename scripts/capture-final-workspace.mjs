import {chromium} from '/Users/holtsdav/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {mkdir} from 'node:fs/promises';
const out=process.cwd()+'/docs/review-2026-10-21/final';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/Users/holtsdav/.cache/puppeteer/chrome/mac_arm-152.0.7977.75/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'});
try {
 const context=await browser.newContext({viewport:{width:1440,height:900}});
 await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 const page=await context.newPage();
 const home=async()=>{await page.goto('http://127.0.0.1:4330/?direction=gallery');await page.waitForFunction(()=>document.querySelector('particle-wordmark')?.dataset.particleReady==='true');await page.waitForTimeout(500);};
 await home();await page.screenshot({path:out+'/home-desktop-live.png'});
 await page.locator('.dock-projects').click();await page.screenshot({path:out+'/folder-desktop.png'});await page.keyboard.press('Escape');
 await page.setViewportSize({width:390,height:844});await home();await page.screenshot({path:out+'/home-mobile-live.png'});
 await page.locator('.dock-projects').click();await page.screenshot({path:out+'/folder-mobile.png'});await page.keyboard.press('Escape');
 await page.emulateMedia({reducedMotion:'reduce'});await page.screenshot({path:out+'/home-mobile-reduced.png'});
 await page.setViewportSize({width:1440,height:900});
 for(const id of ['glassdays','mute-on-location','notilog'])await page.goto('http://127.0.0.1:4330/projects/'+id+'/',{waitUntil:'networkidle'});
 await page.screenshot({path:out+'/notilog-three-open-desktop.png'});
 await page.goto('http://127.0.0.1:4330/projects/glassdays/',{waitUntil:'networkidle'});
 await page.evaluate(async()=>{for(const img of document.querySelectorAll('img')){img.loading='eager';if(!img.complete)await new Promise((r,j)=>{img.onload=r;img.onerror=j});await img.decode();}});
 await page.screenshot({path:out+'/glassdays-desktop-full.png',fullPage:true});
 await page.goto('http://127.0.0.1:4330/about/',{waitUntil:'networkidle'});
 await page.screenshot({path:out+'/about-icon-credit.png',fullPage:true});
 await context.close();
} finally {await browser.close();}
console.log(out);
