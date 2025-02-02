import React from 'react';
import PropTypes from 'prop-types';

import TextArea from '../TextArea';

import Field from './Field';

export default class FormText extends React.Component {
  render() {
    const { label, className, ...rest } = this.props;
    return (
      <Field label={label} className={className}>
        <TextArea {...rest} />
      </Field>
    );
  }
}

FormText.propTypes = {
  label: PropTypes.node,
  className: PropTypes.string,
};
