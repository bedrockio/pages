import React from 'react';
import PropTypes from 'prop-types';

import Toggle from '@components/Toggle';

import Field from './Field';

export default class FormToggle extends React.Component {
  render() {
    const { label, className, ...rest } = this.props;
    return (
      <Field label={label} className={className}>
        <Toggle {...rest} />
      </Field>
    );
  }
}

FormToggle.propTypes = {
  label: PropTypes.node,
  className: PropTypes.string,
};
