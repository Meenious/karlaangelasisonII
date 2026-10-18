(() => {
  'use strict';
  const dialog = document.querySelector('.lightbox');
  const image = document.querySelector('#lightbox-image');
  const caption = document.querySelector('#photo-caption');
  const count = document.querySelector('#photo-count');
  const galleries = {};
  document.querySelectorAll('[data-gallery]').forEach(button => {
    const thumbnail = button.querySelector('img');
    const name = button.dataset.gallery;
    (galleries[name] ||= [])[Number(button.dataset.index)] = {
      src: thumbnail.getAttribute('src'), alt: thumbnail.alt
    };
    button.addEventListener('click', () => {
      currentGallery = name;
      currentIndex = Number(button.dataset.index);
      showPhoto();
      dialog.showModal();
    });
  });
  let currentGallery = 'dining';
  let currentIndex = 0;
  function showPhoto() {
    const photos = galleries[currentGallery];
    const photo = photos[currentIndex];
    image.src = photo.src;
    image.alt = photo.alt;
    caption.textContent = photo.alt;
    count.textContent = `${currentIndex + 1} / ${photos.length}`;
  }
  function changePhoto(direction) {
    const length = galleries[currentGallery].length;
    currentIndex = (currentIndex + direction + length) % length;
    showPhoto();
  }
  document.querySelector('#close-lightbox').addEventListener('click', () => dialog.close());
  document.querySelector('#previous-photo').addEventListener('click', () => changePhoto(-1));
  document.querySelector('#next-photo').addEventListener('click', () => changePhoto(1));
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      changePhoto(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
})();

(() => {
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
