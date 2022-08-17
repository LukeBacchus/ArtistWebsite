import React from 'react';
import { withRouter } from 'react-router-dom';
import { uid } from 'react-uid';
import BlogPost from '../PostComponents/Post/BlogPost';
import ImagePost from '../PostComponents/Post/ImagePost';
import ImagePreview from 'components/Feed/ImagePreview';
import './Feed.css';

class Feed extends React.Component {
  onClickPost = (postId, e) => {
    e.preventDefault();
    this.props.history.push(`/post/${postId}`);
  };

  render() {
    const { feed, view, loggedIn } = this.props;

    switch (view) {
      case 'list':
        return (
          <div className="feed container list-view">
            {feed.map((post) => {
              if (post.type === 'image') {
                return (
                  <ImagePost
                    key={uid(post)}
                    className="post"
                    postId={post._id}
                    onClick={this.onClickPost.bind(this, post._id)}
                    user={post.user}
                    imageURL={post.imageUrl}
                    caption={post.caption}
                    numComments={post.comments.length}
                    numLikes={post.likedBy.length}
                    likedBy={post.likedBy}
                    loggedIn={loggedIn}
                    title={post.title}
                    content={post.content}
                  />
                );
              } else {
                return (
                  <BlogPost
                    key={uid(post)}
                    className="post"
                    postId={post._id}
                    onClick={this.onClickPost.bind(this, post._id)}
                    user={post.user}
                    content={post.content}
                    numComments={post.comments.length}
                    numLikes={post.likedBy.length}
                    likedBy={post.likedBy}
                    loggedIn={loggedIn}
                    title={post.title}
                  />
                );
              }
            })}
          </div>
        );
        break;

      case 'image':
        return (
          <div className="feed container image-view">
            {feed.map((post) => {
              return (
                <ImagePreview
                  key={uid(post)}
                  className="post"
                  onClick={this.onClickPost.bind(this, post._id)}
                  user={post.user}
                  imageURL={post.imageUrl}
                  caption={post.caption}
                  numComments={post.comments.length}
                  numLikes={post.likedBy.length}
                />
              );
            })}
          </div>
        );
        break;

      default:
        return <div>Error</div>;
    }
  }
}

export default withRouter(Feed);
