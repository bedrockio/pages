import { useClass } from 'utils/bem';

export default function Content(props) {
  const { getElementClass } = useClass('modal', props);
  return <div {...props} className={getElementClass('content')} />;
}
