import { canEdit } from '@utils/editor';
import bem from '@utils/bem';

import Icon from '../Icon';

import './login-button.less';

function LoginButton() {
  if (canEdit()) {
    return null;
  }
  return (
    <div className={this.getBlockClass()}>
      <a href="/login">
        <Icon name="key" />
      </a>
    </div>
  );
}

export default bem(LoginButton);
