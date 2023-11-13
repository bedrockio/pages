import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';

import bem from 'utils/bem';

import './message.less';

@bem
export default class Message extends React.Component {
  getModifiers() {
    const { error, success } = this.props;
    return [error ? 'error' : null, success ? 'success' : null];
  }

  render() {
    const props = omit(this.props, Object.keys(Message.propTypes));
    return <div {...props} className={this.getBlockClass()} />;
  }
}

Message.propTypes = {
  error: PropTypes.bool,
  success: PropTypes.bool,
};
