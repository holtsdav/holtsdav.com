const dock = document.querySelector<HTMLElement>('.folio-dock');
const links = [...document.querySelectorAll<HTMLAnchorElement>('.folio-dock a[data-section]')];
const sections = [...document.querySelectorAll<HTMLElement>('[data-portfolio-section]')];

// Native anchor navigation remains available without JavaScript. This only marks
// the section currently being read; it never intercepts or locks scrolling.
if (dock && links.length && sections.length) {
  let scheduled = false;
  let preferredSection = window.location.hash.slice(1);
  const updateSection = () => {
    const readingLine = Math.min(160, window.innerHeight * 0.25);
    let current = sections[0]?.id;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= readingLine) current = section.id;
    }
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) current = sections.at(-1)?.id ?? current;
    const requested = sections.find(section => section.id === preferredSection);
    if (requested) {
      const rect = requested.getBoundingClientRect();
      if (rect.top >= 0 && rect.top < window.innerHeight * .8) current = requested.id;
    }
    for (const link of links) {
      if (link.dataset.section === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    scheduled = false;
  };
  const queueUpdate = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateSection);
  };
  const clearPreference = () => { preferredSection = ''; queueUpdate(); };
  window.addEventListener('hashchange', () => { preferredSection = window.location.hash.slice(1); queueUpdate(); });
  window.addEventListener('wheel', clearPreference, { passive: true });
  window.addEventListener('touchmove', clearPreference, { passive: true });
  window.addEventListener('keydown', event => { if (['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key)) clearPreference(); });
  window.addEventListener('scroll', queueUpdate, { passive: true });
  window.addEventListener('resize', queueUpdate, { passive: true });
  updateSection();
}

const filterBar = document.querySelector<HTMLElement>('[data-project-filters]');
const filterButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-filter]')];
const projects = [...document.querySelectorAll<HTMLElement>('[data-project]')];
const count = document.querySelector<HTMLElement>('[data-filter-count]');
const showProjects = (filter: string) => {
  let visible = 0;
  for (const project of projects) {
    project.hidden = filter !== 'all' && project.dataset.project !== filter;
    if (!project.hidden) visible += 1;
  }
  for (const button of filterButtons) button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
  if (count) count.textContent = `${visible} ${visible === 1 ? 'project' : 'projects'}`;
};
if (filterBar && projects.length) {
  filterBar.hidden = false;
  for (const button of filterButtons) button.addEventListener('click', () => showProjects(button.dataset.filter ?? 'all'));
  // Direct project links should still work after using a filter.
  const revealHashTarget = () => {
    const target = projects.find((project) => `#${project.id}` === window.location.hash);
    if (target?.hidden) {
      showProjects('all');
      target.scrollIntoView({ block: 'start' });
    }
  };
  document.addEventListener('click', (event) => {
    const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
    if (anchor && projects.some((project) => `#${project.id}` === anchor.getAttribute('href') && project.hidden)) showProjects('all');
  });
  window.addEventListener('hashchange', revealHashTarget);
  revealHashTarget();
}

const copyButton = document.querySelector<HTMLButtonElement>('[data-copy-email]');
const copyStatus = document.querySelector<HTMLElement>('[data-copy-status]');
if (copyButton && copyStatus && navigator.clipboard?.writeText) {
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('contact@holtsdav.com');
      copyStatus.textContent = 'Email copied.';
    } catch {
      copyStatus.textContent = 'Copy unavailable. Use the email link above.';
    }
  });
}
