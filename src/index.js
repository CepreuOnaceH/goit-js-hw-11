import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '38934946-e5c499d2b8363eeb7af4782b0';
const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.gallery a');
let currentPage = 1;
let searchQuery = '';

const IMAGES_PER_PAGE = 40;

async function searchImages(query, page) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: 40,
      },
    });

    return response.data.hits;
  } catch (error) {
    console.error(error);
    return [];
  }
}

function renderImageCards(images) {
  images.forEach(image => {
    const card = document.createElement('div');
    card.classList.add('photo-card');
    card.innerHTML = `
      <div class="gallery-item">
        <a href="${image.largeImageURL}" class="gallery-link">
          <img src="${image.webformatURL}" alt="${image.tags}" width="${image.webformatWidth}" height="${image.webformatHeight}" loading="lazy" />
        </a>
      </div>
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    `;
    gallery.appendChild(card);
  });
}

async function loadMoreImages() {
  loadMoreBtn.disabled = true;
  loadMoreBtn.textContent = 'Loading...';

  const images = await searchImages(searchQuery, currentPage + 1);
  if (images.length > 0) {
    renderImageCards(images);
    currentPage++;
    lightbox.refresh();
  } else {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    loadMoreBtn.style.display = 'none';
  }

  loadMoreBtn.disabled = false;
  loadMoreBtn.textContent = 'Load more';
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  gallery.innerHTML = '';
  searchQuery = event.target.searchQuery.value.trim();
  currentPage = 1;

  const images = await searchImages(searchQuery, currentPage);
  if (images.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  renderImageCards(images);
  Notiflix.Notify.success(`Hooray! We found ${images.length} images.`);

  if (images.length >= IMAGES_PER_PAGE) {
    loadMoreBtn.style.display = 'block';
  } else {
    loadMoreBtn.style.display = 'none';
  }

  loadMoreBtn.style.visibility = 'hidden';
  lightbox.refresh();
});

loadMoreBtn.addEventListener('click', loadMoreImages);

window.addEventListener('scroll', async () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    const images = await searchImages(searchQuery, currentPage + 1);
    if (images.length > 0) {
      loadMoreBtn.style.visibility = 'visible';
    } else {
      loadMoreBtn.style.visibility = 'hidden';
      Notiflix.Notify.info("You've reached the end of the search results.");
    }
  } else {
    loadMoreBtn.style.visibility = 'hidden';
  }
});
