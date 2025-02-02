import PropTypes from 'prop-types';

import { useClass } from '@utils/bem';

import './icon.less';

let sets = {};

export default function Icon(props) {
  const { small } = props;
  const { className } = useClass('icon', small ? 'small' : null);

  function getStyles() {
    let { size } = props;
    if (size) {
      if (typeof size === 'number') {
        size = `${size}px`;
      }
      return {
        '--size': size,
      };
    }
  }

  function resolveHref() {
    let { name } = props;
    let set;
    for (let part of name.split(' ')) {
      if (sets[part]) {
        set = part;
      } else {
        name = part;
      }
    }
    set ||= 'default';

    return `${sets[set]}#${name}`;
  }

  function render() {
    const { name, small, ...rest } = props;
    return (
      <svg {...rest} className={className} style={getStyles()}>
        <use href={resolveHref()}></use>
      </svg>
    );
  }

  return render();
}

Icon.useSet = function (url, name = 'default') {
  sets[name] = url;
};

Icon.propTypes = {
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
