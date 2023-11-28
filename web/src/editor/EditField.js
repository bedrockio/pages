import React from 'react';

import { DataContext } from 'stores/data';

import Form from 'components/Form';

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

  render() {
    const { type } = this.props.field;
    if (type.startsWith('image')) {
      return this.renderImage();
    } else if (type === 'text') {
      return this.renderText();
    } else {
      return this.renderString();
    }
  }

  renderString() {
    const { field, label, className } = this.props;
    return (
      <React.Fragment>
        <Form.Input
          label={label}
          value={field.value || ''}
          className={className}
          onChange={this.onValueChange}
        />
      </React.Fragment>
    );
  }

  renderText() {
    const { field, label, className } = this.props;
    return (
      <React.Fragment>
        <Form.Text
          label={label}
          value={field.value || ''}
          className={className}
          onChange={this.onValueChange}
        />
      </React.Fragment>
    );
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
}
