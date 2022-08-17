import React from 'react';
import Feed from '../Feed/Feed';
import { getAllPosts } from '../../actions/post';

class Explore extends React.Component {
  async componentDidMount() {
    document.title = 'CAW | Explore';
    await getAllPosts(this);
  }

  state = {
    posts: []
  };

  render() {
    return (
      <div className="explore main container">
        <h2>Recent Posts</h2>
        <Feed feed={this.state.posts} loggedIn={this.props.loggedIn} view="list" />
      </div>
    );
  }
}

export default Explore;
