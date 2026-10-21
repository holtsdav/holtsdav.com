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
const decode=async()=>{const failures=await page.evaluate(async()=>{const errors=[];await Promise.all([...document.images].map(async img=>{img.loading='eager';try{await img.decode()}catch(error){errors.push({src:img.src,currentSrc:img.currentSrc,complete:img.complete,naturalWidth:img.naturalWidth,error:String(error),html:img.outerHTML.slice(0,500)})}}));return errors});assert.deepEqual(failures,[],JSON.stringify({url:page.url(),failures}));};
const shot=async name=>{await decode();await page.screenshot({path:out+'/screenshots/'+name+'.png',fullPage:true});};
let projects;
try{
 await check('Rendered bounds for all project types, utilities and folder across narrow and intermediate widths',async()=>{for(const route of['/','/projects/glassdays/','/projects/notilog/','/projects/glassdays-catalog/','/projects/pdf-editor/','/about/','/support/','/privacy/','/impressum/']){for(const width of[320,390,620,621,760,761,820,1024,1440]){await page.setViewportSize({width,height:width<600?844:900});await visit(route);const state=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth,bad:[...document.querySelectorAll('h1,h2,.project-title,.project-summary,.project-profile,.project-images,.workspace-dock,.legal-content')].filter(e=>e.getClientRects().length).filter(e=>{const r=e.getBoundingClientRect();return r.left< -1||r.right>innerWidth+1}).map(e=>e.className)}));assert.ok(state.scroll<=width+1&&!state.bad.length,JSON.stringify({route,width,...state}));geometry.push({route,width,passed:true});}if(route.startsWith('/projects/')){await page.setViewportSize({width:390,height:844});await shot('mobile-'+route.split('/')[2]);}}await visit();for(const width of[320,390,768,1440]){await page.setViewportSize({width,height:844});await page.locator('.dock-projects').click();await shot('folder-'+width);const g=await page.locator('.projects-folder').evaluate(e=>({w:e.clientWidth,s:e.scrollWidth,height:e.clientHeight,sh:e.scrollHeight}));assert.ok(g.s<=g.w+1);assert.ok(g.sh<=g.height+1);await page.keyboard.press('Escape');}});
}finally{await browser.close();}
