import '../sass/main.scss';

import cardMarkup from '../templates/card.hbs';
import ImageApiService from './apiService';
import LoadMore from './load-more';

const refs = {
    searchForm: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
};

const loadMore = new LoadMore({
    selector: '[data-action="load-more"]',
    hidden: true, 
});

const imageApiService = new ImageApiService();

refs.searchForm.addEventListener('submit', onSearch);
loadMore.refs.button.addEventListener('click', onLoadMore);

function onSearch(e) {
    e.preventDefault();
    
    clearGalleryContainer();
    imageApiService.query = e.currentTarget.query.value;

    if (imageApiService.query === '') {
        loadMore.disable();
    }

    loadMore.show();
    imageApiService.resetPage();
    fetchCards();
}

function fetchCards() {
    loadMore.disable();
    return imageApiService.fetchImage().then(cards => {
        renderMarkup(cards);

        scrollPage();
        loadMore.enable();

        if (cards.length === 0) {
            loadMore.hide();
        }
    });
}

function onLoadMore() {
    fetchCards();
}

function renderMarkup(hits) {
    refs.gallery.insertAdjacentHTML('beforeend', cardMarkup(hits));
}

function clearGalleryContainer() {
    refs.gallery.innerHTML = '';
}

function scrollPage() {
  try {
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    }, 1000);
  } catch (error) {
    console.log(error);
  }
}