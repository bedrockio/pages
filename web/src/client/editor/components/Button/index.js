import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash-es';

import bem from '@utils/bem';

import './button.less';

class Button extends React.Component {
  static name = 'EditorButton';

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

export default bem(Button);
