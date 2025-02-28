import { localStorage, sessionStorage } from '../storage';

const JWT_KEY = 'jwt';

let storage = localStorage;

// If we have a JWT_KEY in sessionStorage, use that instead
// used by LoginAsUser modal
if (sessionStorage.getItem(JWT_KEY)) {
  storage = sessionStorage;
}

export function hasToken() {
  return !!getToken();
}

export function getToken() {
  return storage.getItem(JWT_KEY);
}

export function setToken(token) {
  if (token) {
    storage.setItem(JWT_KEY, token);
  } else {
    storage.removeItem(JWT_KEY);
  }
}
