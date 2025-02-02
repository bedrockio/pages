class MemoryStorage {
  constructor() {
    this.map = new Map();
  }

  getItem(key) {
    const value = this.map.get(String(key));
    return value == null ? null : String(value);
  }

  setItem(key, val) {
    this.map.set(String(key), String(val));
  }

  removeItem(key) {
    this.map.delete(String(key));
  }

  clear() {
    this.map.clear();
  }

  key(i) {
    if (arguments.length === 0) {
      throw new TypeError('Argument required.');
    }
    return Array.from(this.map.keys())[i];
  }

  get length() {
    return this.map.size;
  }
}

function getStorage(type) {
  try {
    const storage = window[type];
    const test = '__storage_test__';
    storage.setItem(test, test);
    storage.removeItem(test);
    return storage;
  } catch {
    return new MemoryStorage();
  }
}

export const localStorage = getStorage('localStorage');
export const sessionStorage = getStorage('sessionStorage');
