import React from 'react';

import bem from 'utils/bem';

import './field.less';

@bem
export default class Field extends React.Component {
  render() {
    const { label, children, ...rest } = this.props;
    return (
      <fieldset {...rest} className={this.getBlockClass()}>
        {label && <label>{label}</label>}
        {children}
      </fieldset>
    );
  }
}
