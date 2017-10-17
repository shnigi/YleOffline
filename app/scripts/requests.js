import fetchp from 'fetch-jsonp';
import config from '../../config.json';

const baseUrl = 'https://external.api.yle.fi/v1';
/**
 * Fetch the current TV shows using JSONP and fetch JSONP polyfill.
 *
 * @return {Array<Object>} YLE program metadata in unparsed form
 */
export async function fetchCurrentPrograms() {
  const url = new URL(`${baseUrl}/programs/schedules/now.json`);
  const params = url.searchParams;
  params.set('app_id', config.appId);
  params.set('app_key', config.appKey);

  // Fix the jsonp callback function name for service worker compatibility
  const options = {jsonpCallbackFunction: 'jsonp_options'};

  const response = await fetchp(url.href, options);
  // TODO Validate response
  const json = await response.json();
  console.log('data', json.data);
  return json.data;
}
