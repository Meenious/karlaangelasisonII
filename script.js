(() => {
  'use strict';
  const links = [...document.querySelectorAll('.portfolio-navigation nav a')];
  const sections = links.map(link => document.querySelector(link.hash));
  const header = document.querySelector('.portfolio-navigation');
  const toggle = header.querySelector('.navigation-toggle');
  const mobile = window.matchMedia('(max-width: 700px)');
  function closeMenu(restoreFocus = false) {
    header.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    if (restoreFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => {
    const open = header.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  header.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.classList.contains('menu-open')) closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) closeMenu();
  });
  header.addEventListener('focusout', event => {
    if (!header.contains(event.relatedTarget)) closeMenu();
  });
  mobile.addEventListener('change', () => closeMenu());
  let scheduled = false;
  let scrolled = header.classList.contains('is-scrolled');
  let activeIndex = -1;
  function updateNavigation() {

    const scrollY = Math.max(0, window.scrollY);
    const nextScrolled = scrolled ? scrollY > 16 : scrollY > 64;

    const offset = header.getBoundingClientRect().height + 32;
    let active = 0;
    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= offset) active = index;
    });

    const lastSection = sections[sections.length - 1];
    const atBottom = scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    if (atBottom && lastSection && lastSection.getBoundingClientRect().top < window.innerHeight) {
      active = sections.length - 1;
    }
    if (nextScrolled !== scrolled) {
      scrolled = nextScrolled;
      header.classList.toggle('is-scrolled', scrolled);
    }
    if (active !== activeIndex) {
      links.forEach((link, index) => {
        if (index === active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      activeIndex = active;
    }
    scheduled = false;
  }
  function scheduleUpdate() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateNavigation);
    }
  }
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('load', scheduleUpdate);
  updateNavigation();
})();
