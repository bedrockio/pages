import { APP_URL } from 'utils/env';

export default function AppLink(props) {
  return (
    <a
      {...props}
      href={APP_URL}
      target="_blank"
      rel="external noopener noreferrer"
    />
  );
}
