import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';

import Message from 'components/Message';
import Spinner from 'components/Spinner';
import Actions from 'components/Actions';

import bem from 'utils/bem';

import Text from './Text';
import Field from './Field';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import Toggle from './Toggle';
import ImageSet from './ImageSet';

import './form.less';

@bem
export default class Form extends React.Component {
  static Text = Text;
  static Field = Field;
  static Input = Input;
  static Select = Select;
  static Button = Button;
  static Toggle = Toggle;
  static Actions = Actions;
  static ImageSet = ImageSet;

  getModifiers() {
    const { loading, disabled } = this.props;
    return [loading ? 'loading' : null, disabled ? 'disabled' : null];
  }

  onSubmit = (evt) => {
    evt.preventDefault();
    this.props.onSubmit(evt);
  };

  render() {
    const props = omit(this.props, Object.keys(Form.propTypes));
    const { children, ...rest } = props;
    return (
      <form
        {...rest}
        noValidate
        onSubmit={this.onSubmit}
        className={this.getBlockClass()}>
        {this.renderError()}
        {this.renderSpinner()}
        {children}
      </form>
    );
  }

  renderError() {
    const { error } = this.props;
    if (error) {
      return <Message error>{error.message}</Message>;
    }
  }

  renderSpinner() {
    if (this.props.loading) {
      return <Spinner />;
    }
  }
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.instanceOf(Error),
  message: PropTypes.node,
  loading: PropTypes.bool,
};
