import React from 'react';
import Feed from '../../Feed/Feed';
// import { getBlogPostsByUser } from '../../../actions/post';

class Blog extends React.Component {
  render() {
    const blogPosts = this.props.posts?.filter((post) => post.type === 'blog');
    if (!blogPosts || (blogPosts && blogPosts.length === 0)) {
      return <div className="blog container border">This user doesn't have any blog posts at the moment.</div>;
    } else {
      return (
        <div className="blog container">
          <Feed feed={blogPosts} loggedIn={this.props.loggedIn} view="list" />
        </div>
      );
    }
  }
}

export default Blog;
