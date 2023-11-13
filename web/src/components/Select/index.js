import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';

import Icon from 'components/Icon';

import bem from 'utils/bem';

import './select.less';

@bem
export default class Select extends React.Component {
  getModifiers() {
    return [this.isDisabled() ? 'disabled' : null];
  }

  isDisabled() {
    const { disabled, options } = this.props;
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
    const { value, options, placeholder } = this.props;
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
    const { name, options, placeholder } = this.props;
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
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  onChange: PropTypes.func,
  setValue: PropTypes.func,
  placeholder: PropTypes.string,
};

Select.defaultProps = {
  placeholder: 'Select',
  value: '',
};
