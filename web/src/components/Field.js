import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'markdown-to-jsx';
import { Link } from 'react-router-dom';
import { omit } from 'lodash';

import { DataContext } from 'stores/data';

import ExternalLink from 'components/ExternalLink';
import Image from 'components/Image';

import { urlForUpload } from 'utils/uploads';
import { canEdit } from 'utils/editor';

function convertLinks(props) {
  const { href, children } = props;
  if (href.startsWith('http')) {
    return <ExternalLink href={href}>{children}</ExternalLink>;
  } else {
    return <Link to={href}>{children}</Link>;
  }
}

export default class Field extends React.Component {
  static contextType = DataContext;

  componentDidMount() {
    const { name, type } = this.props;
    this.context.setFieldType(name, type);
  }

  getValue() {
    return this.context.getFieldValue(this.props.name);
  }

  getProps() {
    const props = omit(this.props, Object.keys(Field.propTypes));
    return {
      ...props,
      ...this.getEditProps(),
    };
  }

  getEditProps() {
    if (canEdit()) {
      const { name } = this.props;
      return {
        'data-field-name': name,
      };
    }
  }

  getFallback() {
    const { name } = this.props;
    const { name: shortName } = this.context.parseFieldName(name);
    return `[${shortName}]`;
  }

  render() {
    const { type } = this.props;
    const value = this.getValue();
    if (type.startsWith('image')) {
      return this.renderImage(value);
    } else if (type === 'upload') {
      return this.renderUpload(value);
    } else {
      return this.renderText(value);
    }
  }

  renderImage(set) {
    if (set) {
      return <Image set={set} {...this.getProps()} />;
    } else {
      return <span {...this.getProps()}>{this.getFallback()}</span>;
    }
  }

  renderUpload(value) {
    const { children } = this.props;
    if (value) {
      return (
        <ExternalLink href={urlForUpload(value.id)} {...this.getProps()}>
          {children}
        </ExternalLink>
      );
    } else {
      return <span {...this.getProps()}>{children}</span>;
    }
  }

  renderText(value) {
    const { type } = this.props;
    let content = value;

    const Element = type === 'text' ? 'div' : 'span';
    const isMarkdown = type === 'string' || type === 'text';

    if (content && isMarkdown) {
      const options = {
        overrides: {
          a: convertLinks,
        },
      };
      if (type === 'text') {
        options.forceBlock = true;
      } else {
        options.forceInline = true;
      }
      content = <Markdown options={options}>{content}</Markdown>;
    }
    return (
      <Element {...this.getProps()}>{content || this.getFallback()}</Element>
    );
  }

  renderWithBreaks(str) {
    const arr = str.split(' | ');
    return arr.map((el, i) => {
      return (
        <React.Fragment key={i}>
          {el}
          {i < arr.length - 1 && <br />}
        </React.Fragment>
      );
    });
  }
}

Field.propTypes = {
  name: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  type: PropTypes.string,
  fallback: PropTypes.string,
};

Field.defaultProps = {
  type: 'string',
};
