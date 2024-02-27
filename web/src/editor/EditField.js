import React from 'react';
import { pick } from 'lodash';

import { DataContext } from 'stores/data';

import Form from 'components/Form';

const UPLOAD_FIELDS = ['id', 'mimeType', 'filename'];

export default class EditField extends React.Component {
  static contextType = DataContext;

  onValueChange = ({ value }) => {
    this.props.onChange({
      ...this.props.field,
      value,
    });
  };

  onImageChange = ({ value }) => {
    this.props.onChange({
      ...this.props.field,
      value,
    });
  };

  onUploadChange = ({ value }) => {
    this.props.onChange({
      ...this.props.field,
      value: pick(value, UPLOAD_FIELDS),
    });
  };

  render() {
    const { type } = this.props.field;
    if (type.startsWith('image')) {
      return this.renderImage();
    } else if (type === 'upload') {
      return this.renderUpload();
    } else if (type === 'text') {
      return this.renderText();
    } else {
      return this.renderString();
    }
  }

  renderImage() {
    const { field, label, className } = this.props;
    const sizes = this.context.getImageSizes(field.type);
    return (
      <Form.ImageSet
        sizes={sizes}
        label={label}
        value={field.value?.images || []}
        onChange={this.onImageChange}
        onLoadingStart={this.props.onLoadingStart}
        onLoadingStop={this.props.onLoadingStop}
        className={className}
      />
    );
  }

  renderUpload() {
    const { field, label, className } = this.props;
    return (
      <Form.Upload
        label={label}
        value={field.value}
        className={className}
        onChange={this.onUploadChange}
      />
    );
  }

  renderString() {
    const { field, label, className } = this.props;
    return (
      <Form.Input
        label={label}
        value={field.value || ''}
        className={className}
        onChange={this.onValueChange}
      />
    );
  }

  renderText() {
    const { field, label, className } = this.props;
    return (
      <Form.Text
        label={label}
        value={field.value || ''}
        className={className}
        onChange={this.onValueChange}
      />
    );
  }
}
