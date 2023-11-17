import React, { useState, useContext } from 'react';
import { kebabCase, startCase } from 'lodash';

import { replaceElement, removeElement } from 'utils/array';
import { localStorage } from 'utils/storage';
import { request } from 'utils/api';

export const DataContext = React.createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider(props) {
  if (props.data instanceof Error) {
    throw props.data;
  }
  const [data, setData] = useState(getLocal() || props.data);
  const [publishing, setPublishing] = useState(false);

  // Fields

  function getFields() {
    return data.fields || [];
  }

  function getField(name) {
    return getFields().find((field) => {
      return field.name === name;
    });
  }

  function getFieldValue(name) {
    return getField(name)?.value;
  }

  function updateField(update) {
    let fields = getFields();
    const index = fields.findIndex((field) => {
      return field.name === update.name;
    });
    if (index === -1) {
      fields = [...fields, update];
    } else {
      fields = replaceElement(fields, index, update);
    }

    mergeData({
      fields,
    });
  }

  // Field Types

  function setFieldType(name, type) {
    FIELD_TYPES[normalizeFieldName(name)] ||= type;
  }

  function getFieldType(name) {
    return FIELD_TYPES[normalizeFieldName(name)];
  }

  // Images

  function getImageSizes(type) {
    const end = type.split('@')[1];
    const size = parseInt(end) || DEFAULT_SIZE;
    return RATIOS.map((ratio) => {
      return size * ratio;
    });
  }

  // Pages

  const pages = data.pages || [];

  function addPage(page) {
    mergeData({
      pages: [...pages, page],
    });
  }

  function updatePage(index, update) {
    mergeData({
      pages: replaceElement(pages, index, update),
    });
  }

  function removePage(index) {
    mergeData({
      pages: removeElement(pages, index),
    });
  }

  // Collections

  function getCollection(name) {
    return COLLECTIONS[name];
  }

  function setCollection(name, fields) {
    COLLECTIONS[name] ||= fields;
  }

  function updateCollectionFields(collectionName, items) {
    const prefix = getFieldPrefix(collectionName);

    const fields = [
      ...getFields().filter((field) => {
        return !field.name.startsWith(prefix);
      }),
      ...items.flatMap((item, i) => {
        return Object.entries(item).map(([name, field]) => {
          return {
            ...field,
            name: getCollectionFieldName(collectionName, i, name),
          };
        });
      }),
    ];

    mergeData({
      fields,
    });
  }

  function getCollectionFieldName(collectionName, index, fieldName) {
    const prefix = getFieldPrefix(collectionName);
    return `${prefix}_${index}_${fieldName}`;
  }

  function getCollectionItems(name) {
    const prefix = getFieldPrefix(name);

    let length = 0;
    const collectionFields = getFields().filter((field) => {
      return field.name.startsWith(prefix);
    });

    const sparse = {};

    for (let field of collectionFields) {
      const { name, index } = parseFieldName(field.name);

      sparse[index] = {
        ...sparse[index],
        [name]: field,
      };
      length = Math.max(length, index + 1);
    }

    const items = [];

    for (let i = 0; i < length; i++) {
      items.push(sparse[i] || {});
    }

    return items;
  }

  // Publishing

  function canPublish() {
    return hasLocal();
  }

  async function publish(version) {
    if (!canPublish()) {
      throw new Error('No changes to publish.');
    }
    setPublishing(true);
    const { pages, fields } = data;
    await request({
      path: '/1/site/publish',
      method: 'POST',
      body: {
        version,
        pages,
        fields,
      },
    });
    setPublishing(false);
    removeLocal();
  }

  function mergeData(update) {
    const merged = {
      ...data,
      ...update,
    };
    setData(merged);
    storeLocal(merged);
  }
  function reset() {
    removeLocal();
    setData(props.data);
  }

  return (
    <DataContext.Provider
      value={{
        getField,
        getFieldValue,
        pages,
        addPage,
        removePage,
        updatePage,
        getCollection,
        setCollection,
        getCollectionItems,
        getCollectionFieldName,
        updateCollectionFields,
        getPageField,
        parseFieldName,
        humanizeFieldName,
        getImageSizes,
        getFieldType,
        setFieldType,
        updateField,
        publish,
        publishing,
        canPublish,
        reset,
      }}>
      {props.children}
    </DataContext.Provider>
  );
}

DataProvider.defaultProps = {
  data: getData(),
};

const DEFAULT_SIZE = 500;
const RATIOS = [1, 2, 3];

function getLocal() {
  const str = localStorage.getItem('data');
  return str ? JSON.parse(str) : null;
}

function storeLocal(data) {
  localStorage.setItem('data', JSON.stringify(data));
}

function removeLocal() {
  localStorage.removeItem('data');
}

function hasLocal() {
  return !!getLocal();
}

function getData() {
  return typeof window !== 'undefined' && window.__DATA__;
}

// Field: "name"
// Pages: "$about_name"
// Collections: "$users_0_name"
const FIELD_NAME_REG = /^(?:\$([^_]+)(?:_(\d+))?_)?([^_]+)$/;

const FIELD_TYPES = {};
const COLLECTIONS = {};

function parseFieldName(fieldName) {
  const match = fieldName.match(FIELD_NAME_REG);
  const [, prefix, digit, name] = match;
  let type;
  let index;
  if (prefix && digit) {
    type = 'collection';
    index = Number(digit);
  } else if (prefix) {
    type = 'page';
  }
  return {
    type,
    index,
    name,
  };
}

function normalizeFieldName(name) {
  name = name.replace(FIELD_NAME_REG, (all, collection, num, field) => {
    if (collection) {
      return `$${collection}_${field}`;
    } else {
      return all;
    }
  });
  return name;
}

function humanizeFieldName(name) {
  const match = name.match(FIELD_NAME_REG);
  if (match) {
    let [, collection, num, field] = match;
    if (collection && num && field) {
      num = Number(match[2]) + 1;
      name = `${collection} ${num} ${field}`;
    }
  }
  name = startCase(name);
  name = name.replace(/Url/, 'URL');
  return name;
}

function getPageField(page, name) {
  return `${getFieldPrefix(page)}_${name}`;
}

function getFieldPrefix(str) {
  return `$${kebabCase(str)}`;
}
