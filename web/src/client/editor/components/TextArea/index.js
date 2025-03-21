import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash-es';

import bem from '@utils/bem';

import './text-area.less';

class TextArea extends React.Component {
  static name = 'EditorTextArea';

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
    const props = omit(this.props, Object.keys(TextArea.propTypes));
    return (
      <textarea
        {...props}
        value={props.value || ''}
        onChange={this.onChange}
        className={this.getBlockClass()}
      />
    );
  }
}

TextArea.propTypes = {
  onChange: PropTypes.func,
  setValue: PropTypes.func,
};

export default bem(TextArea);
