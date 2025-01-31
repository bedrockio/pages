import { hasToken } from './api';

export function canEdit() {
  return hasToken();
}
