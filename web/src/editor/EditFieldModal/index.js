import React from 'react';

import { DataContext } from 'stores/data';

import Modal from 'components/Modal';
import Form from 'components/Form';
import Button from 'components/Button';

import bem from 'utils/bem';

import EditField from '../EditField';

import './edit-field-modal.less';

@bem
export default class EditFieldModal extends React.Component {
  static contextType = DataContext;

  constructor(props) {
    super(props);
    this.state = {
      field: null,
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
      loading: true,
    });
  };

  onLoadingStop = () => {
    this.setState({
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
    const { field, loading } = this.state;
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
            <EditField
              field={field}
              onChange={this.onFieldChange}
              onLoadingStart={this.onLoadingStart}
              onLoadingStop={this.onLoadingStop}
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
