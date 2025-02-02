import React from 'react';

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
    let { fallback, children } = this.props;
    if (error) {
      return fallback;
    } else {
      return children;
    }
  }
}
