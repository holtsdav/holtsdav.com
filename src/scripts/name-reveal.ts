const nameRoot = document.querySelector<HTMLElement>('[data-name-reveal]');
if (nameRoot) {
  const stage = nameRoot.querySelector<HTMLElement>('.name-stage');
  const replay = nameRoot.querySelector<HTMLButtonElement>('[data-replay-name]');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canAnimate = typeof Element.prototype.animate === 'function';
  let animations: Animation[] = [];
  let generation = 0;
  let startTimer = 0;
  const stop = (phase = 'static') => {
    generation += 1;
    window.clearTimeout(startTimer);
    for (const animation of animations) animation.cancel();
    animations = [];
    nameRoot.dataset.namePhase = phase;
    if (replay) replay.disabled = false;
  };
  const delay = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));
  const play = async () => {
    stop();
    if (!stage || !replay || preference.matches || !canAnimate) return;
    const token = generation;
    replay.disabled = true;
    nameRoot.dataset.namePhase = 'source';
    await delay(1000);
    if (generation !== token) return;
    nameRoot.dataset.namePhase = 'extract';
    await delay(700);
    if (generation !== token) return;
    const bounds = stage.getBoundingClientRect();
    const keys = ['holts', 'dav'] as const;
    const movements = keys.map((key) => {
      const source = nameRoot.querySelector<HTMLElement>(`[data-name-source="${key}"]`)!;
      const target = nameRoot.querySelector<HTMLElement>(`[data-name-result="${key}"]`)!;
      const mover = nameRoot.querySelector<HTMLElement>(`[data-name-mover="${key}"]`)!;
      const from = source.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      mover.style.fontSize = getComputedStyle(source).fontSize;
      mover.style.left = `${to.left - bounds.left}px`;
      mover.style.top = `${to.top - bounds.top}px`;
      const dx = from.left - to.left;
      const dy = from.top - to.top;
      const scale = parseFloat(getComputedStyle(target).fontSize) / parseFloat(getComputedStyle(source).fontSize);
      mover.style.letterSpacing = `${parseFloat(getComputedStyle(target).letterSpacing) / scale}px`;
      const arc = parseFloat(getComputedStyle(source).fontSize) * (key === 'holts' ? -.62 : .62);
      return { mover, dx, dy, scale, arc };
    });
    nameRoot.dataset.namePhase = 'move';
    animations = movements.map(({mover,dx,dy,scale,arc}) => mover.animate([
      { transform: `translate(${dx}px,${dy}px) scale(1)`, opacity: 1 },
      { transform: `translate(${dx}px,${dy + arc}px) scale(1)`, opacity: 1, offset: .22 },
      { transform: `translate(0,${arc}px) scale(1)`, opacity: 1, offset: .68 },
      { transform: `translate(0,0) scale(${scale})`, opacity: 1 },
    ], {duration:1250,easing:'cubic-bezier(.25,.65,.25,1)',fill:'both'}));
    try { await Promise.all(animations.map((animation) => animation.finished)); } catch { return; }
    if (generation !== token) return;
    nameRoot.dataset.namePhase = 'joined';
    for (const animation of animations) animation.cancel();
    animations = [];
    replay.disabled = false;
  };
  const reflectPreference = () => {
    stop();
    if (replay) replay.hidden = preference.matches || !canAnimate;
  };
  reflectPreference();
  replay?.addEventListener('click', () => { void play(); });
  preference.addEventListener('change', reflectPreference);
  window.addEventListener('resize', () => {
    if (nameRoot.dataset.namePhase === 'move' || nameRoot.dataset.namePhase === 'extract') stop('joined');
  }, {passive:true});
  document.addEventListener('visibilitychange', () => {if (document.hidden) stop('joined');});
  if (!preference.matches && canAnimate) startTimer = window.setTimeout(() => {void play();},450);
}
export {};
