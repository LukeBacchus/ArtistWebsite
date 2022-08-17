import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from '@material-ui/core';
import Profile from '../Profile/Profile';
import Gallery from '../Gallery/Gallery';
import Blog from '../Blog/Blog';
import InfoBox from '../../InfoBox/InfoBox';
import Tabs from '../../Tabs/Tabs';
import './ProfilePage.css';
import { getUserProfileByUsername } from 'actions/user';
import { toggleFollowUserById } from 'actions/post';

const TABS = [
  { label: 'Profile', active: true },
  { label: 'Gallery', active: false },
  { label: 'Blog', active: false }
];

class ProfilePage extends React.Component {
  state = {
    currentTab: 'Profile',
    following: false,
    ...this.props
  };

  componentDidMount() {
    this.getUserProfile();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.getUserProfile();
    }
  }

  getUserProfile() {
    const userId = this.props.match.params.id;
    if (userId === 'me') {
      getUserProfileByUsername(this.props.loggedIn.username, this);
    } else {
      getUserProfileByUsername(this.props.match.params.id, this);
    }
  }

  switchTabs(e, tabName) {
    this.setState({
      currentTab: tabName
    });
  }

  getCurrentComponent(currentTab, user, profile, posts, loggedIn, appState) {
    switch (currentTab) {
      case 'Gallery':
        return <Gallery user={user} appState={appState} loggedIn={loggedIn} posts={posts} />;
      case 'Blog':
        return <Blog user={user} loggedIn={loggedIn} posts={posts} />;
      case 'Profile':
      default:
        return <Profile user={user} loggedIn={loggedIn} profile={profile} />;
    }
  }

  subscribeToUser(userId, e) {
    toggleFollowUserById(userId, this);
  }

  render() {
    const { appState, loggedIn } = this.props;
    const { user, responseMessage } = this.state;
    document.title = `CAW | ${user?.username || 'Loading...'}`;

    if (responseMessage) {
      return (
        <div className="profile main container">
          <h2>{responseMessage}</h2>
        </div>
      );
    }
    if (user) {
      const { profile, posts } = this.state.user;
      const { currentTab, following } = this.state;
      if (user.flags.creator) {
        return (
          <div className="profile main container">
            <Tabs onTabClick={this.switchTabs.bind(this)} tabs={TABS} />
            <div className="profile-header">
              <div className="info-box">
                <InfoBox user={user} disableLink={true} />
                {user._id !== loggedIn._id ? (
                  <div id="subscribe-btn">
                    <Button onClick={this.subscribeToUser.bind(this, user._id)} variant="contained">
                      {following ? 'Unfollow' : 'Follow'}
                    </Button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            {this.getCurrentComponent(currentTab, user, profile, posts, loggedIn, appState)}
          </div>
        );
      } else {
        return (
          <div className="profile main container">
            <div id="profile-tabs">
              <ul>
                <li>Profile</li>
              </ul>
            </div>
            <div className="profile-header">
              <div className="info-box">
                <InfoBox user={user} disableLink={true} />
              </div>
            </div>
            {this.getCurrentComponent(currentTab, user, profile, posts, loggedIn, appState)}
          </div>
        );
      }
    } else {
      return <></>;
    }
  }
}

export default withRouter(ProfilePage);
