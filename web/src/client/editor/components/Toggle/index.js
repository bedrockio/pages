import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash-es';

import bem from '@utils/bem';

import './toggle.less';

class Toggle extends React.Component {
  static name = 'EditorToggle';

  onChange = (evt) => {
    evt.stopPropagation();
    const { name, checked } = evt.target;
    const value = checked;
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
    const props = omit(this.props, Object.keys(Toggle.propTypes));
    return (
      <div {...props} className={this.getBlockClass()}>
        {this.renderInput()}
      </div>
    );
  }

  renderInput() {
    const { name, value } = this.props;
    return (
      <input
        name={name}
        type="checkbox"
        checked={value || false}
        onChange={this.onChange}
      />
    );
  }
}

Toggle.propTypes = {
  name: PropTypes.string,
  value: PropTypes.bool,
};

export default bem(Toggle);
