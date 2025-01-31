import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';

import { request } from '@utils/api';
import { urlForUpload } from '@utils/uploads';

import Field from './Field';

export default class Image extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      preview: null,
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

  load = async (value) => {
    if (!value) {
      return;
    }
    const [image] = value;
    if (image) {
      this.props.onLoadingStart?.();
      const { data: upload } = await request({
        method: 'GET',
        path: `/1/uploads/${image.upload}`,
      });
      this.props.onLoadingStop?.();
      this.setState({
        preview: upload,
      });
    }
  };

  onChange = async (evt) => {
    const { name } = evt.target;
    const files = Array.from(evt.target.files);

    const { sizes = [] } = this.props;

    this.props.onLoadingStart?.();

    try {
      const { data: set } = await request({
        method: 'POST',
        path: '/1/site/create-images',
        body: {
          sizes,
        },
        files,
      });
      this.props.onLoadingStop?.();
      const value = {
        ...set,
        images: set.images.map((image) => {
          return {
            ...image,
            upload: image.upload.id,
          };
        }),
      };
      if (this.props.setValue) {
        this.props.setValue(value);
      } else {
        this.props.onChange({
          evt,
          name,
          value,
        });
      }
      const [first] = value.images;
      this.setState({
        preview: first.upload,
      });
    } catch (error) {
      this.props.onError?.(error);
    }
  };

  render() {
    const props = omit(this.props, Object.keys(Image.propTypes));
    const { label, ...rest } = props;
    return (
      <Field label={label}>
        {this.renderPreview()}
        <input
          {...rest}
          type="file"
          accept="image/*"
          onChange={this.onChange}
        />
      </Field>
    );
  }

  renderPreview() {
    const { preview } = this.state;
    if (preview) {
      return (
        <img
          style={{
            display: 'block',
            height: '150px',
            marginBottom: '20px',
          }}
          src={urlForUpload(preview)}
        />
      );
    }
  }
}

Image.propTypes = {
  sizes: PropTypes.arrayOf(PropTypes.number),
  value: PropTypes.arrayOf(PropTypes.object),
  onLoadingStart: PropTypes.func,
  onLoadingStop: PropTypes.func,
};
