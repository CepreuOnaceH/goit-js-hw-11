import Notiflix from 'notiflix';
import { searchImages } from './api.js';
import { refreshLightbox } from './lightbox.js';
import { renderImageCards } from './render.js';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const IMAGES_PER_PAGE = 40;
let currentPage = 1;
let searchQuery = '';

async function loadMoreImages() {
  loadMoreBtn.disabled = true;
  loadMoreBtn.textContent = 'Loading...';

  const images = await searchImages(
    searchQuery,
    currentPage + 1,
    IMAGES_PER_PAGE
  );
  if (images.length > 0) {
    renderImageCards(images);
    currentPage++;
    refreshLightbox();
    if (images.length >= IMAGES_PER_PAGE) {
      loadMoreBtn.style.display = 'block';
    } else {
      loadMoreBtn.style.display = 'none';
    }
  } else {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  loadMoreBtn.disabled = false;
  loadMoreBtn.textContent = 'Load more';
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  gallery.innerHTML = '';
  searchQuery = event.target.searchQuery.value.trim();
  currentPage = 1;

  const images = await searchImages(searchQuery, currentPage, IMAGES_PER_PAGE);
  if (images.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    loadMoreBtn.style.display = 'none';
    return;
  }

  renderImageCards(images);
  Notiflix.Notify.success(`Hooray! We found ${images.length} images.`);

  if (images.length >= IMAGES_PER_PAGE) {
    loadMoreBtn.style.display = 'block';
  } else {
    loadMoreBtn.style.display = 'none';
  }
  refreshLightbox();
});

loadMoreBtn.addEventListener('click', loadMoreImages);
