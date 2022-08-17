import React from 'react';
import Feed from '../../Feed/Feed';

class Gallery extends React.Component {
  render() {
    const imagePosts = this.props.posts?.filter((post) => post.type === 'image');
    if (!imagePosts || (imagePosts && imagePosts.length === 0)) {
      return (
        <div className="gallery container image-view border">This user doesn't have any image posts at the moment.</div>
      );
    }
    return (
      <div className="gallery container image-view">
        <Feed feed={imagePosts} view="image" />
      </div>
    );
  }
}

export default Gallery;
