import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { uid } from 'react-uid';
import { Button, IconButton, TextField } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SearchIcon from '@material-ui/icons/Search';
import { logout } from '../../actions/user';
import './Header.css';

const NAV_LINKS = [
  {
    label: 'Explore',
    path: '/'
  },
  {
    label: 'Dashboard',
    path: '/dashboard'
  },
  {
    label: 'Account',
    path: '/profile/me'
  },
  {
    label: 'Upload',
    path: '/upload'
  },
  {
    label: 'Admin',
    path: '/admin'
  }
];

class Header extends React.Component {
  state = {
    query: '',
    allowedLinks: NAV_LINKS.slice(0, 3)
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

  componentDidUpdate(prevProps) {
    if ((this.props.loggedIn && !prevProps.loggedIn) || (!this.props.loggedIn && prevProps.loggedIn)) {
      this.setAllowedLinks(this.props.loggedIn);
    }
  }

  setAllowedLinks(loggedIn) {
    const allowedLinks = NAV_LINKS.slice(0, 3);
    if (loggedIn?.flags.creator) {
      allowedLinks.push(NAV_LINKS[3]);
    }
    if (loggedIn?.flags.admin) {
      allowedLinks.push(NAV_LINKS[4]);
    }
    this.setState({
      allowedLinks
    });
  }

  render() {
    const { loggedIn, appState } = this.props;

    return (
      <div id="header-container">
        <div id="header">
          <div id="jumplist">
            {this.state.allowedLinks.map((navItem) => (
              <Link
                key={uid(navItem)}
                to={{
                  pathname: navItem.path,
                  state: { loggedIn, appState }
                }}>
                <Button color="primary">{navItem.label}</Button>
              </Link>
            ))}
          </div>

          <div id="logout">
            <IconButton onClick={() => logout(this.props.app, this)}>
              <ExitToAppIcon />
            </IconButton>
          </div>

          <div id="mainsearch" className="search">
            <TextField
              id="search-input"
              value={this.state.query}
              onChange={this.setQuery}
              onKeyPress={this.handleKeyPress}
              label="Search"
              variant="outlined"
              size="small"
            />
            <Link
              to={{
                pathname: '/search/' + this.state.query,
                state: {
                  appState
                }
              }}>
              <IconButton type="submit" aria-label="search">
                <SearchIcon />
              </IconButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
