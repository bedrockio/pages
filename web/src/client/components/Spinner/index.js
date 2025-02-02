import PropTypes from 'prop-types';

import { useClass } from '@utils/bem';

import './spinner.less';

export default function Spinner(props) {
  const { inline } = props;
  const { className } = useClass('spinner', inline ? 'inline' : null);

  return (
    <div className={className}>
      <svg viewBox="25 25 50 50">
        <circle r="20" cx="50" cy="50" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

Spinner.propTypes = {
  inline: PropTypes.bool,
};
