function loadBrowser() {
  if (typeof window !== 'undefined') {
    return window.__ENV__;
  }
}

function loadNode() {
  if (typeof process !== 'undefined') {
    return process.env;
  }
}

export function loadEnv() {
  return loadBrowser() || loadNode() || {};
}

export const { API_URL, API_KEY, ENV_NAME, LANDING_URL } = loadEnv();
