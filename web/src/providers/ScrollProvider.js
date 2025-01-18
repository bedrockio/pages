import { useLocation } from 'react-router';

import { onChange } from 'utils/hooks';

export default function (props) {
  const location = useLocation();

  onChange(() => {
    document.body.scrollTo(0, 0);
  }, [location.pathname]);

  return props.children;
}
