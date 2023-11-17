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
      const srcSet = images
        .map((image) => {
          const { size } = image;
          const url = this.getUrl(image);
          return `${url} ${size}w`;
        })
        .join(', ');
      return {
        srcSet,
        sizes,
        style: {
          '--ratio': ratio,
        },
      };
    }
  }

  render() {
    const props = omit(this.props, Object.keys(Image.propTypes));
    return <img loading="lazy" {...this.getSet()} {...props} />;
  }
}

Image.propTypes = {
  set: PropTypes.object,
};
