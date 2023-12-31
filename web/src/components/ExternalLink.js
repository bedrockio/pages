import React from 'react';

export default class ExternalLink extends React.Component {
  render() {
    const { href, children, icon, ...rest } = this.props;
    return (
      <a
        href={href}
        target="_blank"
        rel="external noopener noreferrer"
        {...rest}>
        {children || href}
      </a>
    );
  }
}
