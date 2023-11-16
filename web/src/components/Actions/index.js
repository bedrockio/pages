import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';

import bem from 'utils/bem';

import './actions.less';

@bem
export default class Actions extends React.Component {
  getModifiers() {
    const { left } = this.props;
    return [left ? 'left' : null];
  }

  render() {
    const props = omit(this.props, Object.keys(Actions.propTypes));
    const Element = this.props.as;
    return <Element {...props} className={this.getBlockClass()} />;
  }
}

Actions.propTypes = {
  as: PropTypes.elementType,
  left: PropTypes.bool,
};

Actions.defaultProps = {
  as: 'div',
  left: false,
};
