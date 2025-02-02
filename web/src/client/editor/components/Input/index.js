import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash-es';

import bem from '@utils/bem';

import './input.less';

class Input extends React.Component {
  static name = 'EditorInput';

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
        value={props.value || ''}
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

export default bem(Input);
