interface ProjectItem {id:string;name:string;icon:string;}
type ParticleElement=HTMLElement&{cleanup?:()=>void;startToken:number;start:()=>Promise<void>};
const items:ProjectItem[]=JSON.parse(document.getElementById('workspace-project-data')?.textContent||'[]');
const valid=new Map(items.map(p=>[p.id,p]));
let opened:string[]=[];
try{const data=JSON.parse(sessionStorage.getItem('portfolio.opened')||'[]');if(Array.isArray(data))opened=[...new Set(data.filter((id):id is string=>typeof id==='string'&&valid.has(id)))];}catch{}
const active=document.body.dataset.currentProject;
if(active&&valid.has(active)&&!opened.includes(active))opened.push(active);
const save=()=>{try{sessionStorage.setItem('portfolio.opened',JSON.stringify(opened));}catch{}};
const strip=document.querySelector<HTMLElement>('[data-opened-projects]');
const divider=document.querySelector<HTMLElement>('[data-dock-divider]');
const closeProject=(id:string)=>{opened=opened.filter(p=>p!==id);save();if(active===id){location.assign('/');return;}render();document.querySelector<HTMLAnchorElement>('.dock-home')?.focus();};
const render=()=>{
 if(!strip)return;strip.replaceChildren();
 for(const id of opened){const p=valid.get(id)!;const group=document.createElement('div');group.className='dock-project-group';const link=document.createElement('a');link.className='dock-item dock-project';link.href=`/projects/${id}/`;link.setAttribute('aria-label',p.name);link.dataset.project=id;if(active===id)link.setAttribute('aria-current','page');const img=document.createElement('img');img.src=p.icon;img.alt='';img.width=56;img.height=56;const label=document.createElement('span');label.textContent=p.name;const dot=document.createElement('i');dot.setAttribute('aria-hidden','true');link.append(img,label,dot);const close=document.createElement('button');close.type='button';close.className='dock-close-project';close.setAttribute('aria-label',`Close ${p.name}`);close.textContent='×';close.addEventListener('click',()=>closeProject(id));group.append(link,close);strip.append(group);}
 strip.hidden=opened.length===0;if(divider)divider.hidden=opened.length===0;
 for(const link of document.querySelectorAll<HTMLElement>('[data-folder-project]')){const id=link.dataset.folderProject!;link.toggleAttribute('data-opened',opened.includes(id));if(id===active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');const name=valid.get(id)?.name||id;link.setAttribute('aria-label',name+(id===active?' — current project':opened.includes(id)?' — opened':''));}
 requestAnimationFrame(()=>{const group=strip.querySelector<HTMLElement>('[aria-current]')?.parentElement;if(group)strip.scrollLeft=group.offsetLeft-(strip.clientWidth-group.offsetWidth)/2;});
};
save();render();
const centerOpenedFocus=(target:HTMLElement)=>{const group=target.closest<HTMLElement>('.dock-project-group');if(strip&&group)strip.scrollLeft=group.offsetLeft-(strip.clientWidth-group.offsetWidth)/2;};
strip?.addEventListener('focusin',event=>{const target=event.target;if(!(target instanceof HTMLElement))return;requestAnimationFrame(()=>{if(document.activeElement===target)centerOpenedFocus(target);});});
if(location.pathname==='/')document.querySelector('.dock-home')?.setAttribute('aria-current','page');
document.querySelectorAll<HTMLElement>('[data-close-project]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();closeProject(button.dataset.closeProject!)}));
const folder=document.querySelector<HTMLDialogElement>('#projects-folder');let invoker:HTMLElement|null=null;
const triggers=[...document.querySelectorAll<HTMLElement>('[data-open-projects]')];
for(const trigger of triggers){trigger.setAttribute('aria-haspopup','dialog');trigger.setAttribute('aria-controls','projects-folder');trigger.setAttribute('aria-expanded','false');}
for(const trigger of triggers)trigger.addEventListener('click',event=>{if(!folder)return;event.preventDefault();invoker=trigger;folder.showModal();for(const trigger of triggers)trigger.setAttribute('aria-expanded','true');});
folder?.querySelector('[data-close-folder]')?.addEventListener('click',()=>folder.close());
folder?.addEventListener('close',()=>{for(const trigger of triggers)trigger.setAttribute('aria-expanded','false');invoker?.focus();});
folder?.addEventListener('click',event=>{const r=folder.getBoundingClientRect();if(event.target===folder&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))folder.close();});
folder?.addEventListener('keydown',event=>{if(event.key==='Tab'){const focusable=[...folder.querySelectorAll<HTMLElement>('a[href],button')];const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}return;}const links=[...folder.querySelectorAll<HTMLAnchorElement>('[data-folder-project]')];const i=links.indexOf(document.activeElement as HTMLAnchorElement);if(i<0)return;let next=i;if(event.key==='ArrowDown'&&i%3<2)next=i+1;else if(event.key==='ArrowUp'&&i%3>0)next=i-1;else if(event.key==='ArrowRight')next=i+3;else if(event.key==='ArrowLeft')next=i-3;else if(event.key==='Home')next=0;else if(event.key==='End')next=links.length-1;else return;event.preventDefault();links[next]?.focus();});
const motionButton=document.querySelector<HTMLButtonElement>('[data-toggle-particles]');
const particle=document.querySelector<ParticleElement>('particle-wordmark');
if(motionButton&&particle){
 const preference=matchMedia('(prefers-reduced-motion: reduce)');let manuallyPaused=false;try{manuallyPaused=sessionStorage.getItem('portfolio.motion')==='paused';}catch{}
 motionButton.setAttribute('aria-pressed',String(manuallyPaused));motionButton.textContent=manuallyPaused?'Play animation':'Pause animation';
 const stop=()=>{particle.startToken++;particle.cleanup?.();particle.cleanup=undefined;};
 const reflect=()=>{motionButton.hidden=preference.matches||(!particle.dataset.particleReady&&!manuallyPaused);if(manuallyPaused)void customElements.whenDefined('particle-wordmark').then(()=>queueMicrotask(()=>queueMicrotask(stop)));};reflect();new MutationObserver(reflect).observe(particle,{attributes:true,attributeFilter:['data-particle-ready']});preference.addEventListener('change',reflect);
 motionButton.addEventListener('click',async()=>{await customElements.whenDefined('particle-wordmark');manuallyPaused=!manuallyPaused;try{sessionStorage.setItem('portfolio.motion',manuallyPaused?'paused':'playing');}catch{}if(manuallyPaused)stop();else await particle.start();motionButton.setAttribute('aria-pressed',String(manuallyPaused));motionButton.textContent=manuallyPaused?'Play animation':'Pause animation';});
}
const more=document.querySelector<HTMLElement>('#workspace-more');const moreButton=document.querySelector<HTMLElement>('[popovertarget="workspace-more"]');
const placeMore=()=>{if(!more?.matches(':popover-open')||!moreButton)return;const r=moreButton.getBoundingClientRect();more.style.left=`${Math.max(12,Math.min(innerWidth-more.offsetWidth-12,r.right-more.offsetWidth))}px`;more.style.right='auto';more.style.bottom=`${innerHeight-r.top+14}px`;};
moreButton?.addEventListener('click',()=>requestAnimationFrame(placeMore));
more?.addEventListener('toggle',placeMore);addEventListener('resize',placeMore,{passive:true});
for(const link of more?.querySelectorAll<HTMLAnchorElement>('a')||[])if(link.pathname===location.pathname)link.setAttribute('aria-current','page');
document.querySelector('.workspace-dock')?.addEventListener('keydown',event=>{const e=event as KeyboardEvent;if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;const targets=[...document.querySelectorAll<HTMLElement>('.workspace-dock .dock-item')];const i=targets.indexOf(document.activeElement as HTMLElement);if(i<0)return;const next=e.key==='Home'?0:e.key==='End'?targets.length-1:e.key==='ArrowRight'?(i+1)%targets.length:(i+targets.length-1)%targets.length;e.preventDefault();const target=targets[next];target?.focus({preventScroll:true});const group=target?.closest<HTMLElement>('.dock-project-group');if(strip&&group)strip.scrollLeft=group.offsetLeft-(strip.clientWidth-group.offsetWidth)/2;});
export {};
