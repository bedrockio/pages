export * from './stores/data';

export { default as Form } from './components/Form';
export { default as Icon } from './components/Icon';
export { default as Meta } from './components/Meta';
export { default as Image } from './components/Image';
export { default as Input } from './components/Input';
export { default as Modal } from './components/Modal';
export { default as Field } from './components/Field';
export { default as Button } from './components/Button';
export { default as Spacer } from './components/Spacer';
export { default as FitText } from './components/FitText';
export { default as Spinner } from './components/Spinner';
export { default as Collection } from './components/Collection';
export { default as ServerError } from './components/ServerError';
export { default as LoginButton } from './components/LoginButton';
export { default as ExternalLink } from './components/ExternalLink';
export { default as ErrorBoundary } from './components/ErrorBoundary';

export * from './components/fields';

// TODO: figure out these better
export { default as PageProvider } from './providers/PageProvider';

export * from './utils';

// This package must export react-router components/hooks for use.
// Attempting to use as a peer dependency will fail due to quirks
// in module resolution with webpack.
export {
  Link,
  Route,
  Routes,
  Outlet,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
