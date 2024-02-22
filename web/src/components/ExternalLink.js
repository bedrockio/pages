import React from 'react';

export default class ExternalLink extends React.Component {
  getHref() {
    const { to, href } = this.props;
    if (href) {
      return href;
    } else if (to) {
      return to;
    }
  }

  render() {
    const { href, children, icon, ...rest } = this.props;
    return (
      <a
        href={this.getHref()}
        target="_blank"
        rel="external noopener noreferrer"
        {...rest}>
        {children || href}
      </a>
    );
  }
}
