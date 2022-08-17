import React from 'react';
import { uid } from 'react-uid';
import './Profile.css';

class Profile extends React.Component {
  render() {
    const { profile } = this.props;
    const noInfo = <p>No info here.</p>;

    return (
      <div className="profile container border">
        <h3>About Me</h3>
        <div className="profile-text">
          {profile && profile.about?.length
            ? profile.about.map((item, index) => <p key={uid(item, index)}>{item}</p>)
            : noInfo}
        </div>
        <h3>Links</h3>
        <div className="profile-links">
          {profile && profile.links?.length ? (
            <ul>
              {profile.links.map((link, index) => (
                <li key={uid(link, index)}>
                  <button onClick={() => window.open(link)}>{link}</button>
                </li>
              ))}
            </ul>
          ) : (
            noInfo
          )}
        </div>
        <h3>Other Information</h3>
        <div className="profile-text">
          {profile && profile.other?.length
            ? profile.other.map((item, index) => <p key={uid(item, index)}>{item}</p>)
            : noInfo}
        </div>
      </div>
    );
  }
}

export default Profile;
