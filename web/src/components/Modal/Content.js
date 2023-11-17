import { forwardRef } from 'react';

import { useClass } from 'utils/bem';

export default forwardRef((props, ref) => {
  const { getElementClass } = useClass('modal', props);
  return <div {...props} ref={ref} className={getElementClass('content')} />;
});
