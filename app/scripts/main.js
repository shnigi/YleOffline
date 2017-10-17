import * as apiRequests from './requests.js';

const programs = document.getElementById('programs');

const getCurrentPrograms = () => {
  apiRequests.fetchCurrentPrograms()
    .then((response) => {
      response.forEach((item) => {
        if (item && item.content && item.content.partOfSeries) {
          const itemId = item.content.partOfSeries.coverImage.id ||
                item.content.partOfSeries.image.id;
          const imageUrl = `http://images.cdn.yle.fi/image/upload/${itemId}.jpg`;
          const itemTitle = item.content.itemTitle.fi || item.content.itemTitle.sv;
        programs.innerHTML += `
        <div class="mdc-card card-image">
            <h1 class="image-title">${itemTitle}</h1>
            <img src="${imageUrl}" class="program-image">
          </div>
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
  getCurrentPrograms();
})();
