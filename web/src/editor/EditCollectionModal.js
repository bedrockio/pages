import React from 'react';
import { startCase } from 'lodash';

import { DataContext } from 'stores/data';

import Modal from 'components/Modal';
import Form from 'components/Form';
import Icon from 'components/Icon';
import Button from 'components/Button';

import bem from 'utils/bem';
import { replaceElement, removeElement } from 'utils/array';

import EditField from './EditField';

import './edit-collection-modal.less';

@bem
export default class EditCollectionModal extends React.Component {
  static contextType = DataContext;

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      collection: null,
    };
  }

  componentDidMount() {
    document.documentElement.addEventListener('click', this.onDocumentClick);
  }

  componentWillUnmount() {
    document.documentElement.removeEventListener('click', this.onDocumentClick);
  }

  onDocumentClick = (evt) => {
    const el = evt.target.closest('[data-collection-name]');
    if (!el) {
      return;
    }
    evt.stopImmediatePropagation();
    const name = el.dataset.collectionName;
    const { fields, limit } = this.context.getCollection(name);
    if (!fields) {
      return;
    }
    const items = this.context.getCollectionItems(name);
    this.setState({
      items,
      collection: {
        name,
        limit,
        fields,
      },
    });
  };

  onValueChange = (evt) => {
    this.setState({
      field: {
        ...this.state.field,
        value: evt.target.value,
      },
    });
  };

  onSubmit = () => {
    const { items } = this.state;
    const { name } = this.state.collection;
    this.context.updateCollectionFields(name, items);
    this.setState({
      collection: null,
    });
  };

  onClose = () => {
    this.setState({
      collection: null,
    });
  };

  render() {
    const { items, collection } = this.state;
    if (!collection) {
      return null;
    }
    return (
      <Modal open className={this.getBlockClass()} onClose={this.onClose}>
        <Modal.Header>Edit Collection</Modal.Header>
        <Modal.Content>
          <Form id="edit-collection" method="dialog" onSubmit={this.onSubmit}>
            {this.renderItems()}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Modal.Actions left>
            <Form.Button
              small
              onClick={this.onAddClick}
              disabled={items.length >= collection.limit}>
              Add Item
            </Form.Button>
          </Modal.Actions>
          <Button onClick={this.onClose}>Cancel</Button>
          <Button form="edit-collection" primary onClick={this.onSubmit}>
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  onAddClick = () => {
    this.setState({
      items: [...this.state.items, {}],
    });
  };

  updateItem(index, update) {
    this.setState({
      items: replaceElement(this.state.items, index, update),
    });
  }

  removeItem(index) {
    this.setState({
      items: removeElement(this.state.items, index),
    });
  }

  renderItems() {
    const { collection, items } = this.state;
    const { getCollectionFieldName } = this.context;
    return items.map((item, i) => {
      return (
        <div key={i} className={this.getElementClass('item')}>
          {Object.entries(collection.fields).map(([name, type]) => {
            const field = item[name] || {
              name: getCollectionFieldName(collection.name, i, name),
              type,
            };
            return (
              <EditField
                key={name}
                field={field}
                label={startCase(name)}
                className={this.getElementClass('item-field')}
                onChange={(update) => {
                  this.updateItem(i, {
                    ...item,
                    [name]: {
                      ...field,
                      ...update,
                    },
                  });
                }}
              />
            );
          })}
          <Form.Button
            small
            negative
            className={this.getElementClass('remove-item')}
            onClick={() => {
              this.removeItem(i);
            }}>
            <Icon name="trash editor" />
          </Form.Button>
        </div>
      );
    });
  }
}
