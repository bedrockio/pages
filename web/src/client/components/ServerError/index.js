import './server-error.less';

export default function ServerError(props) {
  return <div className="server-error">{props.error.message}</div>;
}
