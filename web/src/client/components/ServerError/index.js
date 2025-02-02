import { useData } from '@data';

import './server-error.less';

export default function ServerError() {
  const { error } = useData();
  if (error) {
    return <div className="server-error">{error}</div>;
  }
}
