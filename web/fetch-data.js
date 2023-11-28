const config = require('@bedrockio/config');

async function fetchData(url) {
  url ||= new URL('/1/site', config.get('API_URL'));
  try {
    const ret = await fetch(url);
    let json;
    try {
      json = await ret.json();
    } catch (error) {
      throw new Error('Invalid JSON response from API. Is your URL correct?');
    }
    if (json.error) {
      throw new Error(json.error.message);
    }
    return json.data;
  } catch (error) {
    if (error.cause?.code === 'ECONNREFUSED') {
      throw new Error('Could not load data. Is your API running?');
    }
    throw error;
  }
}

module.exports = fetchData;
