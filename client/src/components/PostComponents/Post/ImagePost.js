import React from 'react';
import { uid } from 'react-uid';
import { IconButton, TextField } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import InfoBox from '../../InfoBox/InfoBox';
import PostInfo from '../PostInfo/PostInfo';
import { modifyPostById, deletePostById } from 'actions/post';
import './ImagePost.css';

class ImagePost extends React.Component {
  state = {
    editMode: false,
    modifiedTitle: '',
    modifiedContent: '',
    modifiedCaption: '',
    ...this.props
  };

  onTextChange(inputFieldName, e) {
    this.setState({
      [inputFieldName]: e.target.value,
      responseMessage: ''
    });
  }

  getPostActionBtns(editMode) {
    if (editMode) {
      return (
        <div className="admin-btns">
          <IconButton
            onClick={this.modifyPost.bind(this, 'save')}
            disabled={
              this.state.title === this.state.modifiedTitle &&
              this.state.content.join('') === this.state.modifiedContent.replaceAll('\n', '')
            }>
            <SaveIcon />
          </IconButton>
          <IconButton onClick={this.modifyPost.bind(this, 'discard')}>
            <CancelIcon />
          </IconButton>
        </div>
      );
    }

    return (
      <div className="admin-btns">
        <IconButton onClick={this.modifyPost.bind(this, 'edit')}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={this.modifyPost.bind(this, 'delete')}>
          <DeleteIcon />
        </IconButton>
      </div>
    );
  }

  modifyPost(action, e) {
    e.preventDefault();
    e.stopPropagation();
    const { postId } = this.props;

    if (action === 'edit') {
      this.setState({
        editMode: true,
        modifiedTitle: this.state.title,
        modifiedContent: this.state.content.join('\n'),
        modifiedCaption: this.state.caption.join('\n')
      });
    } else if (action === 'save') {
      // make save call, post needs to update
      const postPayload = {
        title: this.state.modifiedTitle,
        content: this.state.modifiedContent.split('\n').filter((text) => text !== ''),
        caption: this.state.modifiedCaption.split('\n').filter((text) => text !== '')
      };
      modifyPostById(postId, postPayload, this);
      this.setState({ editMode: false });
    } else if (action === 'delete') {
      deletePostById(postId, this);
    } else if (action === 'discard') {
      // pretend like nothing happened
      this.setState({ editMode: false });
    }
  }

  render() {
    const { user, postId, imageURL, caption, numComments, numLikes, title, content, onPostPage, likedBy } = this.state;

    // edit post state
    const { modifiedTitle, modifiedContent, modifiedCaption, editMode } = this.state;
    const { loggedIn } = this.props;

    return (
      <div
        className={`post container image-post ${editMode ? 'edit' : ''}`}
        onClick={editMode ? () => {} : this.props.onClick}>
        {loggedIn && (user._id === loggedIn._id || loggedIn?.flags.moderator) ? (
          this.getPostActionBtns(editMode)
        ) : (
          <></>
        )}
        <div className="info-box">
          <InfoBox user={user} />
        </div>
        {editMode ? (
          <TextField
            name="title"
            value={modifiedTitle}
            onChange={this.onTextChange.bind(this, 'modifiedTitle')}
            label="Title"
            variant="outlined"
            className="edit-title"
          />
        ) : (
          <h3>{title}</h3>
        )}
        <div className="image container">
          <img className="post-image" src={imageURL} alt="alt post" />
        </div>
        <div className="blog-text">
          {editMode ? (
            <TextField
              name="caption"
              value={modifiedCaption}
              onChange={this.onTextChange.bind(this, 'modifiedCaption')}
              label="Caption"
              variant="outlined"
              className="caption"
              multiline
              rows={6}
            />
          ) : (
            caption.map((line, index) => <p key={uid(`${postId}${index}`)}>{line}</p>)
          )}
          {!onPostPage ? (
            <></>
          ) : editMode ? (
            <TextField
              name="content"
              value={modifiedContent}
              onChange={this.onTextChange.bind(this, 'modifiedContent')}
              label="Content"
              variant="outlined"
              multiline
              rows={6}
            />
          ) : (
            content.map((line, index) => <p key={uid(`${postId}${index}`)}>{line}</p>)
          )}
        </div>
        <div className="post-info">
          <PostInfo
            loggedIn={loggedIn}
            postId={postId}
            likedBy={likedBy}
            numLikes={numLikes}
            numComments={numComments}
          />
        </div>
      </div>
    );
  }
}

export default ImagePost;
