import React from 'react';
import { IconButton } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import './PostInfo.css';
import { toggleLikePostById } from 'actions/post';

class PostInfo extends React.Component {
  state = {
    liked: this.props.likedBy.includes(this.props.loggedIn?._id),
    updatedPost: null
  };

  likePost(postId, loggedIn, e) {
    e.preventDefault();
    e.stopPropagation();
    if (loggedIn) {
      toggleLikePostById(postId, this);
    }
  }

  render() {
    const { numLikes, numComments, postId, loggedIn } = this.props;
    const { liked, updatedPost } = this.state;
    const updatedNumLikes = updatedPost ? updatedPost.likedBy.length : numLikes;
    const updatedLiked = updatedPost === null && this.props.likedBy.includes(this.props.loggedIn?._id) ? true : liked;

    return (
      <div className="post-info container">
        <div className="post-action">
          <IconButton
            onClick={this.likePost.bind(this, postId, loggedIn)}
            className={`like-btn ${updatedLiked ? 'liked' : ''}`}>
            <FavoriteIcon />
          </IconButton>
        </div>
        <div className="post-stats">
          <span className="likes-count">{updatedNumLikes === 1 ? '1 Like' : `${updatedNumLikes} Likes`}</span>
          <span className="comments-count">{numComments === 1 ? '1 Comment' : `${numComments} Comments`}</span>
        </div>
      </div>
    );
  }
}

export default PostInfo;
