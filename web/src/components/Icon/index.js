import React from 'react';
import PropTypes from 'prop-types';

import bem from '@utils/bem';

import './icon.less';

@bem
export default class Icon extends React.Component {
  static sets = {};

  static useSet(url, name = 'default') {
    this.sets[name] = url;
  }

  getModifiers() {
    const { small } = this.props;
    return [small ? 'small' : null];
  }

  getStyles() {
    let { size } = this.props;
    if (size) {
      if (typeof size === 'number') {
        size = `${size}px`;
      }
      return {
        '--size': size,
      };
    }
  }

  resolveHref() {
    let { name } = this.props;
    let set;
    for (let part of name.split(' ')) {
      if (Icon.sets[part]) {
        set = part;
      } else {
        name = part;
      }
    }
    set ||= 'default';

    return `${Icon.sets[set]}#${name}`;
  }

  render() {
    const { name, small, ...rest } = this.props;
    return (
      <svg {...rest} className={this.getBlockClass()} style={this.getStyles()}>
        <use href={this.resolveHref()}></use>
      </svg>
    );
  }
}

Icon.propTypes = {
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
