import React from 'react';
import PropTypes from 'prop-types';

import bem from 'utils/bem';

import './spinner.less';

@bem
export default class Spinner extends React.Component {
  getModifiers() {
    const { inline } = this.props;
    return [inline ? 'inline' : null];
  }

  render() {
    return (
      <div className={this.getBlockClass()}>
        <svg viewBox="25 25 50 50">
          <circle r="20" cx="50" cy="50" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    );
  }
}

Spinner.propTypes = {
  inline: PropTypes.bool,
};
