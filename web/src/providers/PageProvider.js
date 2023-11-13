import { HelmetProvider } from 'react-helmet-async';

import ServerError from 'components/ServerError';

import ScrollProvider from './ScrollProvider';

export default function PageProvider(props) {
  return (
    <HelmetProvider>
      <ScrollProvider>
        <ServerError />
        {props.children}
      </ScrollProvider>
    </HelmetProvider>
  );
}
