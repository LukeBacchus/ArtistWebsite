import React from 'react';
import './ImagePreview.css';

class ImagePreview extends React.Component {
  render() {
    const { imageURL, caption } = this.props;
    return (
      <div className="preview container" onClick={this.props.onClick}>
        <img className="post-image" src={imageURL} alt="alt post" />
        <p className="caption">{caption}</p>
      </div>
    );
  }
}

export default ImagePreview;
