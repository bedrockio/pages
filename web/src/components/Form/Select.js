import React from 'react';
import PropTypes from 'prop-types';

import Select from 'components/Select';

import Field from './Field';

export default class FormSelect extends React.Component {
  render() {
    const { label, className, ...rest } = this.props;
    return (
      <Field label={label} className={className}>
        <Select {...rest} />
      </Field>
    );
  }
}

FormSelect.propTypes = {
  label: PropTypes.node,
  className: PropTypes.string,
};
