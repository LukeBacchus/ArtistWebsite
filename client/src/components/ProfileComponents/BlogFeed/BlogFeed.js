import React from 'react';
import { withRouter } from 'react-router-dom';
import { uid } from 'react-uid';
import BlogPost from '../../PostComponents/Post/BlogPost';
import './BlogFeed.css';

class BlogFeed extends React.Component {
  render() {
    const { blogfeed } = this.props;
    return (
      <div className="blogfeed container">
        {blogfeed.map((blogpost) => (
          <BlogPost
            key={uid(blogpost)}
            user={blogpost.user}
            title={blogpost.title}
            content={blogpost.content}
            numLikes={blogpost.likedBy.length}
            numComments={blogpost.comments.length}
          />
        ))}
      </div>
    );
  }
}

export default withRouter(BlogFeed);
