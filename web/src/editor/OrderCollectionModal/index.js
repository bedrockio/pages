import React from 'react';
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';

import { DataContext } from '@stores/data';

import Icon from '@components/Icon';
import Image from '@components/Image';
import Modal from '@components/Modal';
import Button from '@components/Button';

import { moveElement } from '@utils/array';

import bem from '@utils/bem';

const DragHandle = sortableHandle(({ className }) => {
  return <Icon className={className} name="bars editor" />;
});

const SortableItem = sortableElement(({ children, className }) => {
  return <li className={className}>{children}</li>;
});

const SortableContainer = sortableContainer(({ children, className }) => {
  return <ul className={className}>{children}</ul>;
});

import './order-collection-modal.less';

@bem
export default class OrderCollectionModal extends React.Component {
  static contextType = DataContext;

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      items: props.items,
    };
    this.ref = React.createRef();
  }

  componentDidUpdate(lastProps, lastState) {
    this.checkItems(lastProps);
    this.checkOpen(lastState);
  }

  checkItems(lastProps) {
    const { items } = this.props;
    const { items: lastItems } = lastProps;
    if (items !== lastItems) {
      this.setState({
        items,
      });
    }
  }

  checkOpen(lastState) {
    const { open } = this.state;
    const { open: lastOpen } = lastState;
    if (open !== lastOpen) {
      this.forceUpdate();
    }
  }

  onTriggerClick = () => {
    this.setState({
      open: true,
    });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      items: moveElement(this.state.items, oldIndex, newIndex),
    });
  };

  onClose = () => {
    this.setState({
      open: false,
    });
  };

  onSubmit = (evt) => {
    evt.preventDefault();
    const { items } = this.state;
    this.props.onChange(items);
    this.setState({
      open: false,
    });
  };

  getItemTitle(item, num) {
    if (item.image) {
      return <Image set={item.image.value} sizes="50px" />;
    }
    const field = item.title || item.name;
    if (field) {
      return field.value;
    }
    return num;
  }

  render() {
    return (
      <React.Fragment>
        {this.renderTrigger()}
        {this.renderModal()}
      </React.Fragment>
    );
  }

  renderTrigger() {
    const { trigger } = this.props;
    return React.cloneElement(trigger, {
      onClick: this.onTriggerClick,
    });
  }

  renderModal() {
    const { open } = this.state;
    if (!open) {
      return;
    }

    return (
      <Modal open className={this.getBlockClass()} onClose={this.onClose}>
        <Modal.Header>Reorder Collection</Modal.Header>
        <Modal.Content>
          <div ref={this.ref}>{this.renderItems()}</div>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.onClose}>Cancel</Button>
          <Button primary onClick={this.onSubmit}>
            Done
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  renderItems() {
    const { items } = this.state;
    return (
      <SortableContainer
        useDragHandle
        onSortEnd={this.onSortEnd}
        className={this.getElementClass('container')}
        helperContainer={this.ref.current}>
        {items.map((item, i) => {
          const title = this.getItemTitle(item, i + 1);
          return (
            <SortableItem
              key={i}
              index={i}
              value={title}
              className={this.getElementClass('item')}>
              <DragHandle className={this.getElementClass('handle')} />
              {title}
            </SortableItem>
          );
        })}
      </SortableContainer>
    );
  }
}
