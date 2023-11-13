import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';

import bem from 'utils/bem';

import './input.less';

@bem
export default class Input extends React.Component {
  onChange = (evt) => {
    let { type, name, value } = evt.target;
    if (value && type === 'number') {
      value = Number(value);
    }
    if (this.props.setValue) {
      this.props.setValue(value);
    } else {
      this.props.onChange({
        evt,
        name,
        value,
      });
    }
  };

  render() {
    const props = omit(this.props, Object.keys(Input.propTypes));
    return (
      <input
        {...props}
        onChange={this.onChange}
        className={this.getBlockClass()}
      />
    );
  }
}

Input.propTypes = {
  onChange: PropTypes.func,
  setValue: PropTypes.func,
};

Input.defaultProps = {
  value: '',
};
