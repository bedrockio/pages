import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';

import bem from 'utils/pages-bem';

import './button.less';

@bem
export default class Button extends React.Component {
  getModifiers() {
    const { primary, negative, small } = this.props;
    return [
      small ? 'small' : null,
      primary ? 'primary' : null,
      negative ? 'negative' : null,
    ];
  }

  getType() {
    const { type, submit } = this.props;
    if (type) {
      return type;
    }
    return submit ? 'submit' : 'button';
  }

  render() {
    const props = omit(this.props, Object.keys(Button.propTypes));
    const type = this.getType();
    return <button {...props} type={type} className={this.getBlockClass()} />;
  }
}

Button.propTypes = {
  negative: PropTypes.bool,
  primary: PropTypes.bool,
  submit: PropTypes.bool,
  small: PropTypes.bool,
};
