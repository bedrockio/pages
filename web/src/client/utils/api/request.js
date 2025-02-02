import { ApiError, ApiParseError } from './errors';
import { getToken } from './token';

const { API_KEY, API_URL } = global.env;

export default async function request(options) {
  const { method = 'GET', path, files } = options;
  let { body } = options;

  const token = options.token || getToken();

  const headers = Object.assign(
    {
      Accept: 'application/json',
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      'API-Key': API_KEY,
    },
    options.headers,
  );

  const url = new URL(path, API_URL);

  if (files) {
    const data = new FormData();
    files.forEach((file) => {
      data.append('file', file);
    });
    for (let [key, value] of Object.entries(body || {})) {
      data.append(key, JSON.stringify(value));
    }
    body = data;
  } else if (!(body instanceof FormData)) {
    body = JSON.stringify(body);
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    method,
    headers,
    body,
  });

  if (res.status === 204) {
    return;
  }

  if (
    ['text/csv', 'application/pdf'].includes(res.headers.get('Content-type'))
  ) {
    return res.blob().then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      const filename = res.headers
        .get('Content-Disposition')
        ?.split(';')[1]
        .replace('filename=', '')
        .replace(/"/g, '');

      a.download = filename?.trim() || 'export.csv';
      document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
      a.click();
      a.remove();
      return null;
    });
  }

  if (!res.ok) {
    let type = 'error';
    let message = res.statusText;
    let status = res.status;
    let response;
    try {
      response = await res.clone().json();
      if (response.error) {
        type = response.error.type;
        message = response.error.message;
        status = response.error.status;
      }
    } catch {
      message = await res.clone().text();
    }
    throw new ApiError(message, type, status, response);
  }

  try {
    return await res.json();
  } catch {
    throw new ApiParseError();
  }
}
