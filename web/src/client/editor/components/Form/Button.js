import React from 'react';

import Button from '../Button';

export default class FormButton extends React.Component {
  onClick = (evt) => {
    const { onClick } = this.props;
    if (onClick) {
      evt.preventDefault();
      onClick();
    }
  };

  render() {
    return <Button {...this.props} onClick={this.onClick} />;
  }
}
