import { useRef, useEffect } from 'react';

import './modal.less';

import Actions from '@components/Actions';

import Header from './Header';
import Content from './Content';

export default function Modal(props) {
  const ref = useRef();
  const { open, className, ...rest } = props;

  function getClassName() {
    return ['modal', className].filter((c) => c).join(' ');
  }

  useEffect(() => {
    if (open) {
      ref.current.showModal();
    } else {
      ref.current.close();
    }
  }, [open]);

  return <dialog ref={ref} className={getClassName()} {...rest} />;
}

Modal.Header = Header;
Modal.Content = Content;
Modal.Actions = Actions;
