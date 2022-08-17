import React from 'react';
import { getAllSubscribedPosts } from 'actions/post';
import Feed from '../Feed/Feed';

class Dashboard extends React.Component {
  async componentDidMount() {
    document.title = 'CAW | Dashboard';
    await getAllSubscribedPosts(this);
  }

  state = {
    posts: []
  };

  render() {
    const { loggedIn } = this.props;
    const { posts } = this.state;
    return (
      <div className="dashboard main container">
        <h2>Followed Posts</h2>
        {!posts || (posts && posts.length === 0) ? (
          <p>You are not subscribed to anyone yet!</p>
        ) : (
          <Feed feed={this.state.posts} loggedIn={loggedIn} view="list" />
        )}
      </div>
    );
  }
}

export default Dashboard;
