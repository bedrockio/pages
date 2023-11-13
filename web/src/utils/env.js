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

const ENV = loadBrowser() || loadNode() || {};

export const {
  API_URL,
  APP_NAME,
  APP_URL,
  APP_SUPPORT_EMAIL,
  SENTRY_DSN,
  ENV_NAME,
  GOOGLE_API_KEY,
  SENDBIRD_APPLICATION_ID,
  API_KEY,
} = ENV;
