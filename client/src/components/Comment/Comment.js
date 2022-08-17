import React from 'react';
import { uid } from 'react-uid';
import './Comment.css';
import InfoBox from '../InfoBox/InfoBox';

class Comment extends React.Component {
  render() {
    const { commentInd, user, text } = this.props;

    return (
      <div className="comment container">
        <div className="info-box">
          <InfoBox user={user} />
        </div>
        <div className="comment-text">
          {text.map((line, index) => (
            <p key={uid(line, index + commentInd)}>{line}</p>
          ))}
        </div>
      </div>
    );
  }
}

export default Comment;
