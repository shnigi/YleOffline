import * as apiRequests from './requests.js';
import * as decrypt from './decryptUrl.js';
import config from '../../config.json';
import * as Categories from './categories.js';
import * as VideoMagic from './videoMagic.js';

import MediaList from './views/mediaList.js';
import MediaDetails from './views/mediaDetails.js';
import DownloadedList from './views/downloadedList.js';
import Player from './views/player.js';

const view = document.getElementById('view');
const programsTab = document.getElementById('programs');
const downloadedTab = document.getElementById('tallennettu');

const changeActiveTab = (tab) => {
  if (tab === 'downloads') {
    programsTab.classList.remove('mdc-tab--active');
    downloadedTab.className += ' mdc-tab--active';
  } else if (tab === 'programs') {
    downloadedTab.classList.remove('mdc-tab--active');
    programsTab.className += ' mdc-tab--active';
  }
};

downloadedTab.addEventListener('click', () => changeActiveTab('downloads'));
programsTab.addEventListener('click', () => changeActiveTab('programs'));

const routes = {
  list: showMediaList,
  details: showMediaDetails,
  downloaded: showDownloaded,
  //download: initDownload,
  category: showCategory,
  stream: streamVideo
};

let navIsOpen = false;
const handleNav = () => {
  if (navIsOpen) {
    navIsOpen = false;
    document.getElementById('sideNav').style.width = '0';
  } else {
    navIsOpen = true;
    document.getElementById('sideNav').style.width = '250px';
  }
};

const hamburger = document.getElementById('hamburger-icon');
const hamburgerAnimation = () => hamburger.classList.toggle('open');
hamburger.addEventListener('click', hamburgerAnimation);
hamburger.addEventListener('click', handleNav);

const searchInput = document.getElementById('searchShowsInput');
let timeout = null;
// If user stops typing, after 500ms fetch shows and draw them
async function getMatchingShows() {
  clearTimeout(timeout);
   timeout = setTimeout( () => {
    const value = searchInput.value;
    if (value === '') {
      view.innerHTML = '';
      routes.list();
    } else {
      showSearchResults(value);
    }
    }, 500);
};

async function showSearchResults(queryParam) {
  const mediaItems = await apiRequests.searchPrograms(queryParam);
  const page = new MediaList(view, mediaItems);
  page.render();
};

async function showDownloaded() {
  VideoMagic.vmGetVideoList().then((vids) => {
    const page = new DownloadedList(view, vids);
    page.render();  
  });
};

async function showCategory() {
  const hashPart = location.hash.replace(/^#/, '');
  const category = hashPart.split('/')[1];
  const categoryId = Categories.getCategory(category);
  const mediaItems = await apiRequests.fetchCategoryPrograms(categoryId);
  const page = new MediaList(view, mediaItems);
  page.render();
};

// Add eventlistener to watch changes in search form
searchInput.addEventListener('change', getMatchingShows);
searchInput.addEventListener('keyup', getMatchingShows);

/**
 * Handles the URL (hash part) route change and update the application accordingly.
 */
async function handleRouteChange() {
  // Fetch the current route
  const hashPart = location.hash.replace(/^#/, '');

  // Perform the routing
  const segments = hashPart.split('/');
  const action = segments[0];
  switch (action) {
    case '':
      routes.list();
      break;
    case 'details':
      routes.details(segments[1]);
      break;
    case 'downloaded':
      routes.downloaded();
      break;
    case 'download':
      routes.download(segments[1], segments[2]);
      break;
    case 'category':
      routes.category();
      break;
    default:
      break;
  };
}

async function showMediaList() {
  const mediaItems = await apiRequests.fetchCurrentPrograms();
  const page = new MediaList(view, mediaItems);
  page.render();
};

async function showMediaDetails(id) {
  const item = await apiRequests.fetchMediaItem(id);
  const page = new MediaDetails(view, item);
  page.render();
  const goBack = () => window.history.back();
  const backButton = document.getElementById('goBack');
  backButton.addEventListener('click', goBack);
};

async function initDownload(contentId, mediaId) {
  const encUrl = await apiRequests.fetchEncryptedUrl(contentId, mediaId);
  if (encUrl == null) {
    console.log('No file available');
  } else {
    const url = decrypt.decrypt(encUrl, config.secret);
    const page = new Player(view, url);
    page.render();
  }
};

function streamVideo(url) {
  const page = new Player(view, url);
  page.render();
}

(function() {
  'use strict';
  const isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      window.location.hostname === '[::1]' ||
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js');
  }

  window.addEventListener('hashchange', handleRouteChange);

  //Initialize db for offline videos (if not initialized)
  const indexedDB = window.indexedDB || window.webkitIndexedDB ||
    window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB;
  const open = indexedDB.open('YleOff', 1);
  open.onupgradeneeded = function() {
    const db = open.result;
    const store = db.createObjectStore('Videos');
    const store2 = db.createObjectStore('Clips', {keyPath: 'id'});
    db.close();
  };

  routes.list();
})();
