import React from 'react';

const { APP_NAME, LANDING_URL } = global.env;

import { useData } from '@data';

export default function Meta(props) {
  const { path = location.pathname } = useData();

  function renderCanonical() {
    // Static generation will result in a location of /*
    // for catch all routes which should be assumed to be
    // 404 pages and should not return a canonical tag.
    if (path !== '/*') {
      const href = `${LANDING_URL}${path}`;
      return <link rel="canonical" href={href} />;
    }
  }

  function renderTitle() {
    if (props.title) {
      const title = [props.title, APP_NAME].filter(Boolean).join(' - ');
      return (
        <React.Fragment>
          {renderCanonical()}
          <title>{title}</title>
        </React.Fragment>
      );
    }
  }

  return (
    <React.Fragment>
      {/* {renderCanonical()} */}
      {renderTitle()}
      {props.children}
    </React.Fragment>
  );
}
