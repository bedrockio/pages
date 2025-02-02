/* global __DATA__ */

import { DataProvider } from '@data';

import ServerError from '../components/ServerError';

export default function PageProvider(props) {
  const { data = __DATA__, children } = props;
  return (
    <DataProvider data={data}>
      <ServerError />
      {children}
    </DataProvider>
  );
}
