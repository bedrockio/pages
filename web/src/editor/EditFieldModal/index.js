import React from 'react';

import { DataContext } from '@stores/data';

import Form from '@components/Form';
import Modal from '@components/Modal';
import Button from '@components/Button';
import Message from '@components/Message';

import bem from '@utils/bem';

import EditField from '../EditField';

import './edit-field-modal.less';

@bem
export default class EditFieldModal extends React.Component {
  static contextType = DataContext;

  constructor(props) {
    super(props);
    this.state = {
      field: null,
      error: null,
      loading: false,
    };
  }

  componentDidMount() {
    document.documentElement.addEventListener('click', this.onDocumentClick);
  }

  componentWillUnmount() {
    document.documentElement.removeEventListener('click', this.onDocumentClick);
  }

  onDocumentClick = (evt) => {
    if (evt.target.closest('a:not([data-field-name]),[tabindex]')) {
      return;
    }
    const el = evt.target.closest('[data-field-name]');
    if (!el) {
      return;
    }
    evt.preventDefault();
    evt.stopImmediatePropagation();
    const name = el.dataset.fieldName;
    const type = this.context.getFieldType(name);
    this.setState({
      field: {
        ...this.context.getField(name),
        name,
        type,
      },
    });
  };

  onFieldChange = (field) => {
    this.setState({
      field,
    });
  };

  onLoadingStart = () => {
    this.setState({
      error: null,
      loading: true,
    });
  };

  onLoadingStop = () => {
    this.setState({
      loading: false,
    });
  };

  onError = (error) => {
    this.setState({
      error,
      loading: false,
    });
  };

  onSubmit = () => {
    const { field } = this.state;
    this.context.updateField(field);
    this.setState({
      field: null,
    });
  };

  onClose = () => {
    this.setState({
      field: null,
    });
  };

  render() {
    const { field, loading, error } = this.state;
    if (!field) {
      return null;
    }
    return (
      <Modal open className={this.getBlockClass()} onClose={this.onClose}>
        <Modal.Header>{this.renderTitle()}</Modal.Header>
        <Modal.Content>
          <Form
            id="field"
            method="dialog"
            loading={loading}
            onSubmit={this.onSubmit}>
            {error && <Message error>{error.message}</Message>}
            <EditField
              field={field}
              onChange={this.onFieldChange}
              onLoadingStart={this.onLoadingStart}
              onLoadingStop={this.onLoadingStop}
              onError={this.onError}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.onClose}>Cancel</Button>
          <Button form="field" primary submit>
            Submit
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  renderTitle() {
    const { field } = this.state;
    const humanized = this.context.humanizeFieldName(field.name);
    return `Edit ${humanized}`;
  }
}
