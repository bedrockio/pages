import React from 'react';
import { useLocation } from 'react-router-dom';

import { onChange } from 'utils/hooks';

export default class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    return {
      error,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  dismiss = () => {
    this.setState({
      error: null,
    });
  };

  render() {
    const { error } = this.state;
    const { fallback, children } = this.props;
    if (error) {
      return <PathChange onChange={this.dismiss}>{fallback}</PathChange>;
    } else {
      return children;
    }
  }
}

function PathChange(props) {
  const location = useLocation();
  onChange(props.onChange, [location.pathname]);

  return props.children;
}
