import { useClass } from 'utils/bem';

import './spacer.less';

const SIZES = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

export default function Spacer(props) {
  const { size = 'md' } = props;
  const named = SIZES.includes(size);

  const { className } = useClass('spacer', named ? size : null);

  function getStyles() {
    if (!named) {
      return {
        '--size': size,
      };
    }
  }

  return <div className={className} style={getStyles()} />;
}
