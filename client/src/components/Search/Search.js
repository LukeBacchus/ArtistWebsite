import { searchPosts } from 'actions/post';
import { searchUsers } from 'actions/user';
import React from 'react';
import { Link } from 'react-router-dom';
import Feed from '../Feed/Feed';
import InfoBox from '../InfoBox/InfoBox';
import './Search.css';
import SearchIcon from '@material-ui/icons/Search';
import { Button, IconButton, TextField } from '@material-ui/core';

class Search extends React.Component {
  async componentDidMount() {
    document.title = 'CAW | Search';
    const { query } = this.props;
    if (query) {
      await searchUsers(query, this);
      await searchPosts(query, this);
    }
  }

  state = {
    returnedPosts: [],
    returnedUsers: [],
    responseMessage: null,
    query: ''
  };

  setQuery = (event) => {
    this.setState({
      query: event.target.value
    });
  };

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      window.location.href = '/search/' + this.state.query;
    }
  };

  render() {
    if (this.state.responseMessage) {
      return (
        <div className="search main container">
          <h2>{this.state.responseMessage}</h2>
        </div>
      );
    }

    const { query } = this.props;
    const { returnedUsers, returnedPosts } = this.state;
    console.log(`query = ${query}`);
    if (!query || query === '') {
      return (
        <div className="searchbox main container">
          <TextField
            id="search-input"
            value={this.state.query}
            onChange={this.setQuery}
            onKeyPress={this.handleKeyPress}
            label="Search"
            variant="outlined"
            size="large"
          />
          <Link
            to={{
              pathname: '/search/' + this.state.query
            }}>
            <IconButton type="submit" aria-label="search">
              <SearchIcon />
            </IconButton>
          </Link>
        </div>
      );
    } else {
      return (
        <div className="search main container">
          <h2>Search Results for {query}</h2>
          <h3>Users</h3>
          {!returnedUsers || returnedUsers.length === 0 ? (
            <p>No users found.</p>
          ) : (
            returnedUsers.map((user) => {
              return <InfoBox user={user} />;
            })
          )}
          <h3>Posts</h3>
          {!returnedPosts || returnedPosts.length === 0 ? (
            <p>No posts found.</p>
          ) : (
            <Feed feed={returnedPosts} view="list" />
          )}
        </div>
      );
    }
  }
}

export default Search;
