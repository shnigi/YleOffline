import * as apiRequests from './requests.js';
import * as decrypt from './decryptUrl.js';
import config from '../../config.json';

const programsView = document.getElementById('programs');

const getCurrentPrograms = () => {
  apiRequests.fetchCurrentPrograms()
    .then((response) => {
      response.forEach((item) => {
        if (item && item.content && item.content.partOfSeries) {
          const itemId = item.content.partOfSeries.coverImage.id ||
                item.content.partOfSeries.image.id;
          const imageUrl = `http://images.cdn.yle.fi/image/upload/${itemId}.jpg`;
          const itemTitle = item.content.itemTitle.fi || item.content.itemTitle.sv;
          const mediaId = item.content.publicationEvent
            .map((e) => {
              if (!e.media || !e.media.available) {
                return null;
              }

              return e.media.id;
            })
            .find((id) => id !== null);
        programsView.innerHTML += `
        <a href="#${item.content.id}/${mediaId}"><div class="mdc-card card-image">
            <h1 class="image-title">${itemTitle}</h1>
            <img src="${imageUrl}" style="width:100%;">
          </div></a>
        `;
      } else {
        const imageUrl = 'images/no-image.jpg';
        const itemTitle = item.content.itemTitle.fi || item.content.itemTitle.sv;
      programs.innerHTML += `
      <div class="mdc-card card-image">
          <h1 class="image-title">${itemTitle}</h1>
          <img src="${imageUrl}" class="program-image">
        </div>
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
  console.log(`Handle route change '${hashPart}'`);

  // Perform the routing
  const segments = hashPart.split('/');
  const contentId = segments[0];
  const mediaId = segments[1];
  const encUrl = await apiRequests.fetchEncryptedUrl(contentId, mediaId);
  const url = decrypt.decrypt(encUrl, config.secret);
  console.log(url);
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
