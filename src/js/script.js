import { BASE_URL, options } from './pixabay-api.js';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio.js';
import simpleLightboxk from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryEl = document.querySelector('.gallery');
const searchInputEl = document.querySelector('input[name="searchQuery"]');
const searchFormEl = document.getElementById('search-form');

let reachEnd = false;
let totalHits = 0;

const lightbox = new simpleLightboxk('.lightbox', {
  captionsData: 'alt',
  captionDelay: 250,
});

function renderGallery(hits) {
  let markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
          <a href="${largeImageURL}" class="lightbox">
            <div class="photo-card">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                <div class="info">
                  <p class="info-item">
                  Likes:
                    <b>${likes}</b>
                  </p>
                  <p class="info-item">
                  Views:
                    <b>${views}</b>
                  </p>
                  <p class="info-item">
                  Comments:
                    <b>${comments}</b>
                  </p>
                  <p class="info-item">
                  Download:
                    <b>${downloads}</b>
                  </p>
                </div>
            </div>
          </a>
      `;
      }
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);

  if (options.params.page * options.params.per_page >= totalHits) {
    if (!reachEnd) {
      Notify.info("We are sorry but you've reached end of the search result");
    }
  }

  lightbox.refresh();
}

async function handleSubmit(e) {
  e.preventDefault();
  options.params.q = searchInputEl.value.trim();

  if (options.params.q === '') return;
  options.params.page = 1;
  galleryEl.innerHTML = '';
  reachEnd = false;

  try {
    const res = await axios.get(BASE_URL, options);
    totalHits = res.data.totalHits;

    const { hits } = res.data;

    if (hits.length === 0) {
      Notify.failure('Sorry there are no images matching your search query');
    } else {
      Notify.success(`Hooray! WE found ${totalHits} images`);
      renderGallery(hits);
    }
    searchInputEl.value = '';
  } catch (e) {
    Notify.failure(e);
  }
}
async function loadMore() {
  options.params.page += 1;
  try {
    const res = await axios.get(BASE_URL, options);
    const hits = res.data.hits;
    renderGallery(hits);
  } catch (e) {
    Notify.failure(e);
  }
}

async function loadMore() {
  options.params.page += 1;
  try {
    const res = await axios.get(BASE_URL, options);
    const hits = res.data.hits;
    renderGallery(hits);
  } catch (e) {
    Notify.failure(e);
  }
}

function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight) {
    loadMore();
  }
}

searchFormEl.addEventListener('submit', handleSubmit);
window.addEventListener('scroll', handleScroll);
