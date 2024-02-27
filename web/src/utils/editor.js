import { hasToken } from 'utils/api';

export function canEdit() {
  return hasToken();
}
