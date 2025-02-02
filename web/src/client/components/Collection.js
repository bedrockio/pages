import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { omit, mapValues } from 'lodash-es';

import { useData } from '@data';

import { canEdit } from '@utils/editor';

import Field from './Field';

const propTypes = {
  name: PropTypes.string.isRequired,
  fields: PropTypes.object.isRequired,
  renderItem: PropTypes.func,
  limit: PropTypes.number,
  sizes: PropTypes.Object,
};

function Collection(props, ref) {
  const { name, children, renderItem, fields, limit } = props;

  const { setCollection, getCollectionItems, getFieldValue, setFieldType } =
    useData();

  setCollection(name, {
    fields,
    limit,
  });

  const items = getCollectionItems(name);

  function render() {
    const elProps = omit(props, Object.keys(propTypes));
    return (
      <div {...elProps} {...getEditProps()} ref={ref}>
        {renderItems()}
      </div>
    );
  }

  function renderItems() {
    if (!items.length) {
      return 'No Items';
    }
    const mapped = items.map((item, i) => {
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

      return [renderProps, data];
    });

    if (typeof children === 'function') {
      return children(mapped);
    } else if (typeof renderItem === 'function') {
      return mapped.map((mapped, i) => {
        return <React.Fragment key={i}>{renderItem(...mapped)}</React.Fragment>;
      });
    } else {
      throw new Error(
        'Collection component requires renderItem or children as a function.',
      );
    }
  }

  function getEditProps() {
    if (canEdit()) {
      return {
        'data-collection-name': name,
      };
    }
  }

  return render();
}

export default forwardRef(Collection);
