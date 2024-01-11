import React from 'react';
import PropTypes from 'prop-types';

import Input from 'components/Input';

import Field from './Field';

export default class FormInput extends React.Component {
  render() {
    return (
      <Field {...this.props}>
        <Input {...this.props} />
      </Field>
    );
  }
}

FormInput.propTypes = {
  label: PropTypes.node,
  className: PropTypes.string,
};
