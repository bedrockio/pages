import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash-es';

import Icon from '@components/Icon';

import bem from '@utils/bem';

import './select.less';

class Select extends React.Component {
  static name = 'EditorSelect';

  getModifiers() {
    return [this.isDisabled() ? 'disabled' : null];
  }

  getOptions() {
    let { options } = this.props;
    if (!Array.isArray(options)) {
      options = Object.entries(options).map(([key, value]) => {
        return {
          value: key,
          label: value,
        };
      });
    }
    return options;
  }

  isDisabled() {
    const { disabled } = this.props;
    const options = this.getOptions();
    return disabled || !options.length;
  }

  onChange = (evt) => {
    let { name, value, selectedIndex } = evt.target;
    const index = selectedIndex - 1;
    if (this.props.setValue) {
      this.props.setValue(value);
    } else {
      this.props.onChange({
        evt,
        name,
        value,
        index,
      });
    }
  };

  render() {
    const props = omit(this.props, Object.keys(Select.propTypes));
    return (
      <div {...props} className={this.getBlockClass()}>
        {this.renderPlaceholder()}
        {this.renderIcon()}
        {this.renderNative()}
      </div>
    );
  }

  renderPlaceholder() {
    const { value = '', placeholder = 'Select' } = this.props;

    const options = this.getOptions();
    const selected = options.find((option) => {
      return option.value === value;
    });
    return (
      <div className={this.getElementClass('placeholder')}>
        {selected?.label || placeholder}
      </div>
    );
  }

  renderIcon() {
    return <Icon name="angle-down" />;
  }

  renderNative() {
    const { name, placeholder } = this.props;
    const options = this.getOptions();
    return (
      <select name={name} onChange={this.onChange} defaultValue="">
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => {
          const { value, label } = option;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
    );
  }
}

Select.propTypes = {
  options: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      }),
    ),
    PropTypes.object,
  ]),
  onChange: PropTypes.func,
  setValue: PropTypes.func,
  placeholder: PropTypes.string,
};

export default bem(Select);
