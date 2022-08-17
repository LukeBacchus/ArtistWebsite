import React from 'react';
import { withRouter } from 'react-router-dom';
import { uid } from 'react-uid';
import AddComment from '../../AddComment/AddComment';
import Comment from '../../Comment/Comment';
import ImagePost from '../Post/ImagePost';
import BlogPost from '../Post/BlogPost';
import './PostPage.css';
import { addComment, getPostById } from 'actions/post';

class PostPage extends React.Component {
  state = {
    ...this.props,
    responseMessage: null
  };

  async componentDidMount() {
    window.scrollTo(0, 0);
    await getPostById(this.props.match.params.id, this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.post && this.props.post._id !== prevProps.post?._id) {
      this.setState({
        post: this.props.post,
        responseMessage: null
      });
    }
  }

  submitContent(commentText) {
    const { post } = this.state;
    const comment = commentText.split('\n').filter((text) => text !== '');
    const commentPayload = {
      postId: post._id,
      content: comment
    };

    addComment(commentPayload, this);
  }

  render() {
    const { post, responseMessage } = this.state;
    document.title = `CAW | ${post?.title || 'Loading...'}`;

    if (responseMessage) {
      return (
        <div className="post-page main container">
          <h2>{responseMessage}</h2>
        </div>
      );
    }

    if (post) {
      const { user, imageUrl, caption, content, likedBy, comments, title, _id, type } = post;
      let postElem;
      if (type === 'image') {
        postElem = (
          <ImagePost
            postId={_id}
            user={user}
            imageURL={imageUrl}
            caption={caption}
            numLikes={likedBy.length}
            likedBy={likedBy}
            numComments={comments.length}
            title={title}
            content={content}
            onPostPage={true}
            loggedIn={this.props.loggedIn}
          />
        );
      } else {
        postElem = (
          <BlogPost
            postId={_id}
            user={user}
            title={title}
            content={content}
            numComments={comments.length}
            numLikes={likedBy.length}
            likedBy={likedBy}
            loggedIn={this.props.loggedIn}
          />
        );
      }
      return (
        <div className="post-page main container">
          {postElem}
          {comments.map((comment, index) => (
            <Comment key={uid(comment, index)} user={comment.user} text={comment.content} commentInd={index} />
          ))}
          <div className="add-comment">
            <AddComment submitContent={this.submitContent.bind(this)} loggedIn={this.props.loggedIn} />
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  }
}

export default withRouter(PostPage);
