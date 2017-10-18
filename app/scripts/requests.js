import fetchp from 'fetch-jsonp';
import config from '../../config.json';

const baseUrl = 'https://external.api.yle.fi/v1';
/**
 * Fetch the current TV shows using JSONP and fetch JSONP polyfill.
 *
 * @return {Array<Object>} YLE program metadata in unparsed form
 */
export async function fetchCurrentPrograms() {
  const url = new URL(`${baseUrl}/programs/items.json`);
  const params = url.searchParams;
  params.set('app_id', config.appId);
  params.set('app_key', config.appKey);
  params.set('type', 'tvcontent');
  params.set('downloadable', true);
  params.set('availability', 'ondemand');
  params.set('mediaobject', 'video');

  // Fix the jsonp callback function name for service worker compatibility
  const options = {jsonpCallbackFunction: 'jsonp_options'};

  const response = await fetchp(url.href, options);
  // TODO Validate response
  const json = await response.json();
  return json.data;
}

/**
 * fetchEncryptedUrl - description
 *
 * @param  {type} programId description
 * @param  {type} mediaId   description
 * @return {type}           description
 */
export async function fetchEncryptedUrl(programId, mediaId) {
  const url = new URL(`${baseUrl}/media/playouts.json`);
  const params = url.searchParams;
  params.set('app_id', config.appId);
  params.set('app_key', config.appKey);
  params.set('program_id', programId);
  params.set('media_id', mediaId);
  params.set('protocol', 'PMD');

  // Fix the jsonp callback function name for service worker compatibility
  const options = {jsonpCallbackFunction: 'jsonp_url'};
  try {
    const response = await fetchp(url.href, options);
    // TODO Validate response
    const json = await response.json();
    return json.data[0].url;
  } catch (e) {
    return null;
  }
};

/**
 * searchPrograms - description
 *
 * @param  {type} queryParam description
 * @return {type}            description
 */
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
    return json.data;
  } catch (e) {
    return null;
  }
};
