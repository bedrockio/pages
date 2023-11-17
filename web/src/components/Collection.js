import React, { forwardRef } from 'react';
import { mapValues } from 'lodash';

import { useData } from 'stores/data';

import Field from './Field';

function Collection(props, ref) {
  const { name, render, fields, limit, ...rest } = props;

  const { setCollection, getCollectionItems, getFieldValue } = useData();

  setCollection(name, {
    fields,
    limit,
  });

  const items = getCollectionItems(name);

  function renderItems() {
    if (items.length) {
      return items.map((item, i) => {
        const renderProps = mapValues(item, (field, key) => {
          const { name } = field;
          const type = fields[key];
          return <Field name={name} type={type} />;
        });

        const data = mapValues(item, (field) => {
          const { name } = field;
          return getFieldValue(name);
        });

        data.number = i + 1;

        return (
          <React.Fragment key={i}>{render(renderProps, data)}</React.Fragment>
        );
      });
    } else {
      return 'No Items';
    }
  }

  return (
    <div {...rest} ref={ref} data-collection-name={name}>
      {renderItems()}
    </div>
  );
}

export default forwardRef(Collection);
