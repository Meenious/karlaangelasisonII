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
