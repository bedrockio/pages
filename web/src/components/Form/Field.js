import React from 'react';

import bem from 'utils/bem';

import './field.less';

@bem
export default class Field extends React.Component {
  getDisabled() {
    const { props, context } = this;
    return props.disabled || context.disabled;
  }

  render() {
    const { label, children, ...rest } = this.props;
    return (
      <fieldset
        {...rest}
        disabled={this.getDisabled()}
        className={this.getBlockClass()}>
        {label && <label>{label}</label>}
        {children}
      </fieldset>
    );
  }
}
