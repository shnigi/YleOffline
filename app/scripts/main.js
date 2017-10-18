import * as apiRequests from './requests.js';
import * as draw from './drawItems.js';
import * as decrypt from './decryptUrl.js';
import config from '../../config.json';

const programsView = document.getElementById('programs');
const searchInput = document.getElementById('searchShowsInput');
let timeout = null;

// If user stops typing, after 500ms fetch shows and draw them
const getMatchingShows = () => {
  clearTimeout(timeout);
   timeout = setTimeout( () => {
    const value = searchInput.value;
    if (value === '') {
      programs.innerHTML = '';
      getCurrentPrograms();
    } else {
      apiRequests.searchPrograms(value)
      .then((response) => {
        programs.innerHTML = '';
        response.forEach((item) => {
          draw.drawItems(item);
        });
      });
    }
    }, 500);
};

// Add eventlistener to watch changes in search form
searchInput.addEventListener('change', getMatchingShows);
searchInput.addEventListener('keyup', getMatchingShows);

const getCurrentPrograms = () => {
  apiRequests.fetchCurrentPrograms()
    .then((response) => {
      response.forEach((item) => {
        console.log('item', item);
        if (item && item.partOfSeries) {
          const itemId = item.partOfSeries.coverImage.id ||
                item.partOfSeries.image.id;
          const imageUrl = `http://images.cdn.yle.fi/image/upload/${itemId}.jpg`;
          const itemTitle = item.itemTitle.fi || item.itemTitle.sv;
          const mediaId = item.publicationEvent
            .map((e) => {
              if (!e.media || !e.media.available) {
                return null;
              }

              return e.media.id;
            })
            .find((id) => id !== null);
        programsView.innerHTML += `
        <a href="#${item.id}/${mediaId}"><div class="mdc-card card-image">
            <h1 class="image-title">${itemTitle}</h1>
            <img src="${imageUrl}" style="width:100%;">
          </div></a>
        `;
      } else {
        const imageUrl = 'images/no-image.jpg';
        const itemTitle = item.itemTitle.fi || item.itemTitle.sv;
        const mediaId = item.publicationEvent
        .map((e) => {
          if (!e.media || !e.media.available) {
            return null;
          }

          return e.media.id;
        })
        .find((id) => id !== null);
        programs.innerHTML += `
        <a href="#${item.id}/${mediaId}"><div class="mdc-card card-image">
            <h1 class="image-title">${itemTitle}</h1>
            <img src="${imageUrl}" class="program-image">
          </div></a>
        `;
    }
    });
    });
};

/**
 * Handles the URL (hash part) route change and update the application accordingly.
 *
 * @return {undefined} - No actual return value
 */
async function handleRouteChange() {
  // Fetch the current route
  const hashPart = location.hash.replace(/^#/, '');

  // Perform the routing
  const segments = hashPart.split('/');
  const contentId = segments[0];
  const mediaId = segments[1];
  const encUrl = await apiRequests.fetchEncryptedUrl(contentId, mediaId);
  if (encUrl == null) {
    console.log('No file available');
  } else {
    const url = decrypt.decrypt(encUrl, config.secret);
    console.log(url);
  }
  return;
}

(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  const isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js');
  }

  // Your custom JavaScript goes here
  window.addEventListener('hashchange', handleRouteChange);
  getCurrentPrograms();
})();
