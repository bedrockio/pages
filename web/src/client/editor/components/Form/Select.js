import React from 'react';
import PropTypes from 'prop-types';

import Select from '../Select';

import Field from './Field';

export default class FormSelect extends React.Component {
  render() {
    return (
      <Field {...this.props}>
        <Select {...this.props} />
      </Field>
    );
  }
}

FormSelect.propTypes = {
  label: PropTypes.node,
  className: PropTypes.string,
};
