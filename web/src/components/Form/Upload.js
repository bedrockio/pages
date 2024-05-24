import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';

import ExternalLink from 'components/ExternalLink';

import { request } from 'utils/api';
import { urlForUpload } from 'utils/uploads';

import Field from './Field';

export default class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      uploads: [],
    };
  }

  componentDidMount() {
    this.load(this.props.value);
  }

  componentDidUpdate(lastProps) {
    const { value } = this.props;
    const { value: lastValue } = lastProps;
    if (value !== lastValue) {
      this.load(value);
    }
  }

  isMultiple() {
    return Array.isArray(this.props.value);
  }

  load = async (value) => {
    if (!value) {
      return;
    }
    const values = Array.isArray(value) ? value : [value];

    this.props.onLoadingStart?.();

    const uploads = await Promise.all(
      values.map(async (value) => {
        if (typeof value === 'string') {
          const { data } = await request({
            method: 'GET',
            path: `/1/uploads/${value}`,
          });
          return data;
        } else {
          return value;
        }
      }),
    );
    this.setState({
      uploads,
    });
    this.props.onLoadingStop?.();
  };

  onChange = async (evt) => {
    const { name } = evt.target;
    const files = Array.from(evt.target.files);
    this.props.onLoadingStart?.();
    try {
      const { data: uploads } = await request({
        method: 'POST',
        path: '/1/site/create-uploads',
        files,
      });

      let value;
      if (this.isMultiple()) {
        value = uploads;
      } else {
        value = uploads[0];
      }
      this.props.onLoadingStop?.();
      if (this.props.setValue) {
        this.props.setValue(value);
      } else {
        this.props.onChange({
          evt,
          name,
          value,
        });
      }
      this.setState({
        uploads,
      });
    } catch (error) {
      this.props.onError?.(error);
    }
  };

  render() {
    const props = omit(this.props, Object.keys(Upload.propTypes));
    const { label, ...rest } = props;
    return (
      <Field label={label}>
        {this.renderFiles()}
        <input {...rest} type="file" accept="*/*" onChange={this.onChange} />
      </Field>
    );
  }

  renderFiles() {
    const { uploads } = this.state;
    return uploads.map((upload) => {
      const { id, filename } = upload;
      const url = urlForUpload(id);
      return (
        <ExternalLink href={url} key={id}>
          {filename}
        </ExternalLink>
      );
    });
  }
}

Upload.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
  ]),
  onLoadingStart: PropTypes.func,
  onLoadingStop: PropTypes.func,
};
