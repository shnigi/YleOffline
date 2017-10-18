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
  params.set('availability', 'ondemand');
  params.set('mediaobject', 'video');

  const options = {jsonpCallbackFunction: 'jsonp_options'};

  const response = await fetchp(url.href, options);
  const json = await response.json();
  return json.data.map((item) => new MediaItem(item));
}

export async function fetchMediaItem(id) {
  const mediaUrl = new URL(`${baseUrl}/programs/items/${id}.json`);
  const mediaParams = mediaUrl.searchParams;
  mediaParams.set('app_id', config.appId);
  mediaParams.set('app_key', config.appKey);

  const mediaOptions = {jsonpCallbackFunction: 'jsonp_mediaitem'};

  const mediaResponse = await fetchp(mediaUrl.href, mediaOptions);
  const mediaJson = await mediaResponse.json();
  const programId = mediaJson.data.partOfSeries.id;

  const url = new URL(`${baseUrl}/programs/items.json`);
  const params = url.searchParams;
  params.set('app_id', config.appId);
  params.set('app_key', config.appKey);
  params.set('type', 'tvcontent');
  params.set('availability', 'ondemand');
  params.set('mediaobject', 'video');
  params.set('series', programId);

  const options = {jsonpCallbackFunction: 'jsonp_programitem'};

  const response = await fetchp(url.href, options);
  const json = await response.json();
  const episodes = json.data.map((item) => new MediaItem(item));
  return {program: mediaJson.data.partOfSeries, episodes: episodes};
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
  params.set('type', 'tvcontent');
  params.set('availability', 'ondemand');
  params.set('mediaobject', 'video');

  const options = {jsonpCallbackFunction: 'jsonp_search'};
  try {
    const response = await fetchp(url.href, options);
    const json = await response.json();
    return json.data.map((item) => new MediaItem(item));
  } catch (e) {
    return null;
  }
};
