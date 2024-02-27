import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { omit, mapValues } from 'lodash';

import { useData } from 'stores/data';

import Field from './Field';

const propTypes = {
  name: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired,
  fields: PropTypes.object.isRequired,
  limit: PropTypes.number,
  sizes: PropTypes.Object,
};

function Collection(props, ref) {
  const { name, render, fields, limit } = props;

  const { setCollection, getCollectionItems, getFieldValue, setFieldType } =
    useData();

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
          setFieldType(name, type);
          return <Field name={name} type={type} />;
        });

        let data = mapValues(item, (field) => {
          const { name } = field;
          return getFieldValue(name);
        });

        data = {
          ...data,
          index: i,
          number: i + 1,
        };

        return (
          <React.Fragment key={i}>{render(renderProps, data)}</React.Fragment>
        );
      });
    } else {
      return 'No Items';
    }
  }

  const elProps = omit(props, Object.keys(propTypes));

  return (
    <div {...elProps} ref={ref} data-collection-name={name}>
      {renderItems()}
    </div>
  );
}

export default forwardRef(Collection);
