import React from 'react';
import PropTypes from 'prop-types';

import Input from 'components/Input';

import Field from './Field';

export default class FormInput extends React.Component {
  render() {
    const { label, className, ...rest } = this.props;
    return (
      <Field label={label} className={className}>
        <Input {...rest} />
      </Field>
    );
  }
}

FormInput.propTypes = {
  label: PropTypes.node,
  className: PropTypes.string,
};
