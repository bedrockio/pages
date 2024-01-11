import React from 'react';

import bem from 'utils/bem';

import { ApiError } from 'utils/api';

import './field.less';

@bem
export default class Field extends React.Component {
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
    const { children } = this.props;
    return (
      <fieldset disabled={this.getDisabled()} className={this.getBlockClass()}>
        {this.renderLabel()}
        {children}
        {this.renderError()}
      </fieldset>
    );
  }

  renderLabel() {
    let { label, required } = this.props;
    if (!label) {
      return;
    }
    if (required) {
      label = (
        <React.Fragment>
          {label}
          <span className="required">*</span>
        </React.Fragment>
      );
    }
    return <label>{label}</label>;
  }

  renderError() {
    const error = this.getError();
    if (error) {
      return <div className="error">{error.message}</div>;
    }
  }
}
