import React from 'react';

import Actions from 'components/Actions';

export default class Field extends React.Component {
  getDisabled() {
    const { props, context } = this;
    return props.disabled || context.disabled;
  }

  render() {
    return (
      <Actions {...this.props} as="fieldset" disabled={this.getDisabled()} />
    );
  }
}
