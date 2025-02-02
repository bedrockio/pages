/* global __DATA__ */

import { DataProvider } from '@data';

export default function PageProvider(props) {
  const { path, data = __DATA__, children } = props;
  return (
    <DataProvider path={path} data={data}>
      {children}
    </DataProvider>
  );
}
