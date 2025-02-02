import { useRef, useEffect } from 'react';

import { useClass } from '@utils/bem';

import './modal.less';

import Actions from '../Actions';

import Header from './Header';
import Content from './Content';

export default function Modal(props) {
  const ref = useRef();
  const { open, ...rest } = props;

  const { className } = useClass('editor-modal', props);

  useEffect(() => {
    if (open) {
      ref.current.showModal();
    } else {
      ref.current.close();
    }
  }, [open]);

  return <dialog {...rest} ref={ref} className={className} />;
}

Modal.Header = Header;
Modal.Content = Content;
Modal.Actions = Actions;
