import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';

import { urlForUpload } from 'utils/uploads';

export default class Image extends React.Component {
  getUrl(image) {
    let { url, upload } = image;
    if (upload) {
      url = urlForUpload(upload);
    }
    return url;
  }

  getSet() {
    let { set, sizes } = this.props;
    if (set) {
      const { ratio, images } = set;
      const [first] = images;
      const srcSet = images
        .map((image) => {
          const { size } = image;
          const url = this.getUrl(image);
          return `${url} ${size}w`;
        })
        .join(', ');
      sizes ||= `${first.size}px`;
      return {
        srcSet,
        sizes,
        style: {
          aspectRatio: ratio,
        },
      };
    }
  }

  render() {
    const props = omit(this.props, Object.keys(Image.propTypes));
    return <img {...this.getSet()} {...props} />;
  }
}

Image.propTypes = {
  set: PropTypes.object,
};
