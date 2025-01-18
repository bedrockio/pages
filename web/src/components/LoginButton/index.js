import React from 'react';
import { Link } from 'react-router';

import Icon from 'components/Icon';

import bem from 'utils/bem';
import { canEdit } from 'utils/editor';

import './login-button.less';

@bem
export default class LoginButton extends React.Component {
  render() {
    if (canEdit()) {
      return null;
    }
    return (
      <div className={this.getBlockClass()}>
        <Link to="/login">
          <Icon name="key" />
        </Link>
      </div>
    );
  }
}
