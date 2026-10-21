import assert from 'node:assert/strict';
import http from 'node:http';
import path from 'node:path';
import {readFile,stat,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from '/Users/holtsdav/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
const out=path.resolve('docs/review-2026-10-21/clean-commit');await mkdir(out,{recursive:true});
const candidate=JSON.parse(await readFile('docs/review-2026-10-21/commit-candidate.json','utf8'));
const dist=path.join(candidate.path,'dist');
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.gif':'image/gif'};
const server=http.createServer(async(req,res)=>{try{let target=path.resolve(dist,'.'+new URL(req.url,'http://localhost').pathname);assert.ok(target.startsWith(dist+path.sep)||target===dist);if((await stat(target)).isDirectory())target=path.join(target,'index.html');res.setHeader('Content-Type',types[path.extname(target)]??'application/octet-stream');res.end(await readFile(target));}catch{res.writeHead(404);res.end('Not found');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,executablePath:'/Users/holtsdav/.cache/puppeteer/chrome/mac_arm-152.0.7977.75/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'});
const results=[],errors=[];
try{
 const context=await browser.newContext({reducedMotion:'reduce'});
 await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const selectors=['body','h1','.workspace-dock','.home-caption','.gallery-project>span','.project-summary','.project-bottom','.utility-page','.legal-content','.legal-content h2','.legal-content p','.language-switcher a'];
 for(const route of ['/','/projects/glassdays/','/projects/notilog/','/projects/pdf-editor/','/about/','/support/','/contact/','/privacy/','/impressum/','/privacy/glassdays/','/privacy/glassdays/es/','/privacy/muteonlocation/']){
  for(const width of [390,1440]){
   await page.setViewportSize({width,height:width===390?844:900});
   const observations=[];
   for(const [name,url] of [['reviewed','http://127.0.0.1:4330'],['candidate',base]]){
    await page.goto(url+route,{waitUntil:'networkidle'});
    await page.evaluate(async()=>{for(const img of document.querySelectorAll('img')){if(!img.complete)await new Promise((r,j)=>{img.addEventListener('load',r,{once:true});img.addEventListener('error',j,{once:true});img.loading='eager';if(img.complete)r();});await img.decode();}});
    const styles=await page.evaluate(selectors=>selectors.flatMap(selector=>[...document.querySelectorAll(selector)].filter(e=>e.getClientRects().length).slice(0,4).map(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return{selector,text:e.tagName==='BODY'?'':e.textContent.trim().slice(0,60),left:r.left,top:r.top,width:r.width,height:r.height,color:s.color,background:s.backgroundColor,border:s.borderColor,shadow:s.boxShadow,font:s.fontFamily,fontSize:s.fontSize,lineHeight:s.lineHeight};})),selectors);
    const shot=await page.screenshot({path:out+'/'+name+'-'+(route==='/'?'home':route.replaceAll('/','-').slice(1,-1))+'-'+width+'.png'});
    observations.push({name,styles,pngSha256:createHash('sha256').update(shot).digest('hex')});
   }
   const a=observations[0],b=observations[1];
   const differences=a.styles.flatMap((s,i)=>JSON.stringify(s)===JSON.stringify(b.styles[i])?[]:[{reviewed:s,candidate:b.styles[i]}]);
   results.push({route,width,pixelIdentical:a.pngSha256===b.pngSha256,computedDifferences:differences,passed:!differences.length});
  }
 }
 assert.deepEqual(errors,[]);
 assert.ok(results.every(r=>r.passed),JSON.stringify(results.filter(r=>!r.passed)));
 console.log('PASS clean commit candidate: 24 route/width comparisons have identical reviewed computed layout/styles; zero browser exceptions');
 console.log('Pixel-identical captures: '+results.filter(r=>r.pixelIdentical).length+'/'+results.length);
 await context.close();
}finally{await browser.close();await new Promise(r=>server.close(r));await writeFile(out+'/comparison.json',JSON.stringify({candidateBaseline:candidate.baseline,ownerOnlyFilesIncluded:false,results,errors},null,2)+'\n');}
