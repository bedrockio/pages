import { API_URL } from './env';

export function urlForUpload(upload) {
  const id = upload.id || upload;
  return `${API_URL}/1/uploads/${id}/raw`;
}
