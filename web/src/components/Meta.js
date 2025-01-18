import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router';

import { LANDING_URL } from 'utils/env';

export default function Meta(props) {
  const { pathname } = useLocation();

  function renderCanonical() {
    // Static generation will result in a location of /*
    // for catch all routes which should be assumed to be
    // 404 pages and should not return a canonical tag.
    if (pathname !== '/*') {
      const href = `${LANDING_URL}${pathname}`;
      return <link rel="canonical" href={href} />;
    }
  }

  return (
    <Helmet>
      {renderCanonical()}
      {props.children}
    </Helmet>
  );
}
