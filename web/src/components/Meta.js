import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

export default function Meta(props) {
  const location = useLocation();
  return (
    <Helmet>
      <link rel="canonical" href={location.href} />
      {props.children}
    </Helmet>
  );
}
