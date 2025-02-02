import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash-es';

import bem from '@utils/bem';

import './actions.less';

class Actions extends React.Component {
  static name = 'EditorActions';

  getModifiers() {
    const { left } = this.props;
    return [left ? 'left' : null];
  }

  render() {
    const props = omit(this.props, Object.keys(Actions.propTypes));
    const Element = this.props.as || 'div';
    return <Element {...props} className={this.getBlockClass()} />;
  }
}

Actions.propTypes = {
  as: PropTypes.elementType,
  left: PropTypes.bool,
};

export default bem(Actions);
