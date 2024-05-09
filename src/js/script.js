import { BASE_URL, options } from './pixabay-api';
import axios from 'axios';
import { Notify } from 'notiflix';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryEl = document.querySelector('.gallery');
const searchInputEl = document.querySelector('input[name="searchQuery"]');
const searchFormEl = document.getElementById('search-form');

let reachEnd = false;
let totalHits = 0;

const lightbox = new simpleLightbox('.lightbox', {
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
                <b>Likes</b>
                ${Number(likes).toLocaleString('en')}
            </p>
            <p class="info-item">
                <b>Views</b>
                ${Number(views).toLocaleString('en')}
            </p>
            <p class="info-item">
                <b>Comments</b>
                ${Number(comments).toLocaleString('en')}
            </p>
            <p class="info-item">
                <b>Downloads</b>
                ${Number(downloads).toLocaleString('en')}
            </p>
            </div>
        </div>
        </a>
    `;
      }
    )
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

async function handleSubmit(e) {
  e.preventDefault();
  options.params.q = searchInputEl.value.trim();
  options.params.page = 1;

  if (options.params.q === '') return;

  galleryEl.innerHTML = '';
  reachEnd = false;

  try {
    const res = await axios.get(BASE_URL, options);
    totalHits = res.data.totalHits;
    const hits = res.data.hits;

    // console.log(hits);
    if (totalHits === 0) {
      Notify.failure(`Sorry, there are no images matching your search.`);
    } else {
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    searchFormEl.value = '';
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
    if (
      totalHits > 0 &&
      options.params.page * options.params.per_page >= totalHits
    ) {
      Notify.info(`We're sorry but you reached the end of the search result. `);
      return;
    }
    loadMore();
  }
}

searchFormEl.addEventListener('submit', handleSubmit);
window.addEventListener('scroll', handleScroll);
