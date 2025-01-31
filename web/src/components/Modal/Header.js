import { useClass } from '@utils/bem';

export default function Header(props) {
  const { getElementClass } = useClass('modal', props);
  return <h3 className={getElementClass('header')}>{props.children}</h3>;
}
