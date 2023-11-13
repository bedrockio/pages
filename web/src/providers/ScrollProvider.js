import { useLocation } from 'react-router-dom';

import { onChange } from 'utils/hooks';

export default function (props) {
  const location = useLocation();

  onChange(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [location.pathname]);

  return props.children;
}
