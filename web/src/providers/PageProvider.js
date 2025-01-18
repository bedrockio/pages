import { BrowserRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';

import { DataProvider } from 'stores/data';

import ServerError from 'components/ServerError';

import ScrollProvider from './ScrollProvider';

export default function PageProvider(props) {
  return (
    <BrowserRouter>
      <HelmetProvider prioritizeSeoTags>
        <DataProvider>
          <ScrollProvider>
            <ServerError />
            {props.children}
          </ScrollProvider>
        </DataProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
}
