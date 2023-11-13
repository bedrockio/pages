import React from 'react';
import { mapValues } from 'lodash';

import { useData } from 'stores/data';

import Field from './Field';

export default function Collection(props) {
  const { name, render, ...rest } = props;

  const { setCollection, getCollectionItems } = useData();

  setCollection(name, rest);
  const items = getCollectionItems(name);

  function renderItems() {
    if (items.length) {
      return items.map((item, i) => {
        item = mapValues(item, (field) => {
          const { name, type } = field;
          return <Field name={name} type={type} />;
        });
        return <React.Fragment key={i}>{render(item)}</React.Fragment>;
      });
    } else {
      return 'No Items';
    }
  }

  return <div data-collection-name={name}>{renderItems()}</div>;
}
