import React from 'react';

import bem from '@utils/bem';
import { ApiError } from '@utils/api';

import './field.less';

class Field extends React.Component {
  static name = 'EditorField';

  getModifiers() {
    const error = this.getError();
    return [error === true ? 'error' : null];
  }

  getError() {
    const { name, error } = this.props;
    if (error instanceof ApiError) {
      return error.getField(name);
    } else if (error instanceof Error) {
      return error;
    }
  }

  getDisabled() {
    const { props, context } = this;
    return props.disabled || context.disabled;
  }

  render() {
    return (
      <fieldset disabled={this.getDisabled()} className={this.getBlockClass()}>
        {this.renderBody()}
        {this.renderError()}
      </fieldset>
    );
  }

  renderBody() {
    const { children } = this.props;
    if (this.props.label) {
      return this.renderWithLabel();
    } else {
      return children;
    }
  }

  renderWithLabel() {
    let { label, children, required } = this.props;
    return (
      <label>
        <span>
          {label}
          {required && <span className="required">*</span>}
        </span>
        {children}
      </label>
    );
  }

  renderError() {
    const error = this.getError();
    if (error) {
      return <div className="error">{error.message}</div>;
    }
  }
}

export default bem(Field);
