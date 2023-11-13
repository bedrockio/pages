import React from 'react';
import { Link } from 'react-router-dom';

import Icon from 'components/Icon';

import bem from 'utils/bem';
import { hasToken } from 'utils/api';

import './login-button.less';

@bem
export default class LoginButton extends React.Component {
  render() {
    if (hasToken()) {
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
