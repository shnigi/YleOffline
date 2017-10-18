import fetchp from 'fetch-jsonp';
import config from '../../config.json';
import MediaItem from './mediaItem.js';

const baseUrl = 'https://external.api.yle.fi/v1';

export async function fetchCurrentPrograms() {
  const url = new URL(`${baseUrl}/programs/items.json`);
  const params = url.searchParams;
  params.set('app_id', config.appId);
  params.set('app_key', config.appKey);
  params.set('type', 'tvcontent');
  params.set('downloadable', true);
  params.set('availability', 'ondemand');
  params.set('mediaobject', 'video');

  const options = {jsonpCallbackFunction: 'jsonp_options'};

  const response = await fetchp(url.href, options);
  const json = await response.json();
  return json.data.map((item) => new MediaItem(item));
}

export async function fetchMediaItem(id) {
  const url = new URL(`${baseUrl}/programs/items/${id}.json`);
  const params = url.searchParams;
  params.set('app_id', config.appId);
  params.set('app_key', config.appKey);

  const options = {jsonpCallbackFunction: 'jsonp_mediaitem'};

  const response = await fetchp(url.href, options);
  const json = await response.json();
  return new MediaItem(json.data);
}

export async function fetchEncryptedUrl(programId, mediaId) {
  const url = new URL(`${baseUrl}/media/playouts.json`);
  const params = url.searchParams;
  params.set('app_id', config.appId);
  params.set('app_key', config.appKey);
  params.set('program_id', programId);
  params.set('media_id', mediaId);
  params.set('protocol', 'PMD');

  const options = {jsonpCallbackFunction: 'jsonp_url'};
  try {
    const response = await fetchp(url.href, options);
    const json = await response.json();
    return json.data[0].url;
  } catch (e) {
    return null;
  }
};

export async function searchPrograms(queryParam) {
  const url = new URL(`${baseUrl}/programs/items.json`);
  const params = url.searchParams;
  params.set('app_id', config.appId);
  params.set('app_key', config.appKey);
  params.set('q', queryParam);
  params.set('limit', 10);
  params.set('typeMedia', 'TVContent');

  const options = {jsonpCallbackFunction: 'jsonp_url'};
  try {
    const response = await fetchp(url.href, options);
    const json = await response.json();
    return json.data.map((item) => new MediaItem(item));
  } catch (e) {
    return null;
  }
};

export async function fetchCategoryPrograms(category) {
  const url = new URL(`${baseUrl}/programs/items.json`);
  const params = url.searchParams;
  params.set('app_id', config.appId);
  params.set('app_key', config.appKey);
  params.set('category', category);
  params.set('limit', 10);

  const options = {jsonpCallbackFunction: 'jsonp_url'};
  try {
    const response = await fetchp(url.href, options);
    const json = await response.json();
    return json.data.map((item) => new MediaItem(item));
  } catch (e) {
    return null;
  }
};
