import * as apiRequests from './requests.js';
import * as decrypt from './decryptUrl.js';
import config from '../../config.json';

import MediaList from './views/mediaList.js';

const view = document.getElementById('view');

const routes = {
  list: showMediaList
};

/**
 * Handles the URL (hash part) route change and update the application accordingly.
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
    console.log("No file available");
  } else {
    const url = decrypt.decrypt(encUrl, config.secret);
    console.log(url);  
  }
}

async function showMediaList() {
  const mediaItems = await apiRequests.fetchCurrentPrograms();
  const page = new MediaList(view, mediaItems);
  page.render();
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
  routes.list();
})();
