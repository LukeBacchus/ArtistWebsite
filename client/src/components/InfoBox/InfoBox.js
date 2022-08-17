import React from 'react';
import { withRouter } from 'react-router-dom';
import sampleIcon from '../../assets/sample-icon.png';
import './InfoBox.css';

class InfoBox extends React.Component {
  navigateTo(user, e) {
    e.preventDefault();
    e.stopPropagation();
    const newUrl = `/profile/${user.username}`;
    if (newUrl !== this.props.history.location.pathname) {
      this.props.history.push(`/profile/${user.username}`);
    }
  }

  render() {
    const { user, disableLink } = this.props;
    return (
      <div className="info-box container">
        <img className="user-icon" src={sampleIcon} alt="user-icon" />
        <div className="user-name">
          <a
            className={disableLink ? 'disabled profile-url' : 'profile-url'}
            onClick={this.navigateTo.bind(this, user)}>
            {user.flags.deleted ? 'Deleted User' : user.displayName}
          </a>
        </div>
      </div>
    );
  }
}

export default withRouter(InfoBox);
