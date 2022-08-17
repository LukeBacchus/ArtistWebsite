import React from 'react';
import { Button, TextField } from '@material-ui/core';
import Tabs from '../Tabs/Tabs';
import { createBlogPost, createImagePost } from '../../actions/post';
import './Upload.css';

const TABS = [
  { label: 'Image', active: true },
  { label: 'Blog', active: false }
];

class Upload extends React.Component {
  state = {
    postTitle: '',
    imageURL: '',
    captionText: '',
    contentText: '',
    imageFiles: null,
    currentTab: 'Image',
    responseMessage: ''
  };

  componentDidMount() {
    document.title = 'CAW | Upload';
  }

  switchTabs(e, tabName) {
    this.setState({
      currentTab: tabName
    });
  }

  getCurrentForm(currentTab, contentText, captionText) {
    switch (currentTab) {
      case 'Image':
        return (
          <>
            <div className="input file">
              <input type="file" name="image" onChange={this.onFileUpload.bind(this)} />
            </div>
            <div className="input content">
              <TextField
                name="caption"
                value={captionText}
                onChange={this.onTextChange.bind(this, 'captionText')}
                label="Caption"
                multiline
                rows={3}
                variant="outlined"
              />
            </div>
            <div className="input content">
              <TextField
                name="content"
                value={contentText}
                onChange={this.onTextChange.bind(this, 'contentText')}
                label="Content"
                multiline
                rows={6}
                variant="outlined"
              />
            </div>
          </>
        );
      case 'Blog':
        return (
          <div className="input content">
            <TextField
              name="content"
              value={contentText}
              onChange={this.onTextChange.bind(this, 'contentText')}
              label="Content"
              multiline
              rows={6}
              variant="outlined"
            />
          </div>
        );
      default:
        return <div />;
    }
  }

  onFileUpload(e) {
    const image = e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : '';
    this.setState({
      imageFiles: e.target.files,
      imageURL: image
    });
  }

  onTextChange(inputFieldName, e) {
    this.setState({
      [inputFieldName]: e.target.value,
      responseMessage: ''
    });
  }

  submitContent(e) {
    e.preventDefault();
    const { postTitle, contentText, captionText } = this.state;

    const content = contentText.split('\n').filter((text) => text !== '');
    const caption = captionText.split('\n').filter((text) => text !== '');

    if (this.state.currentTab === 'Image') {
      const formData = new FormData(e.target);
      formData.set('content', content);
      formData.set('caption', caption);
      createImagePost(formData, this, e.target);
    } else {
      createBlogPost(
        {
          content,
          title: postTitle
        },
        this
      );
    }
  }

  validSubmission() {
    const { postTitle, imageURL, contentText, currentTab } = this.state;

    return postTitle.length > 0 && contentText.length > 0 && (currentTab === 'Image' ? !!imageURL : true);
  }

  render() {
    const { postTitle, contentText, captionText, currentTab, responseMessage } = this.state;
    return (
      <div className="main upload-container">
        <h2>Upload a post</h2>
        <Tabs onTabClick={this.switchTabs.bind(this)} tabs={TABS} />
        <form id="upload-form" onSubmit={this.submitContent.bind(this)}>
          <div className="input post-title">
            <TextField
              name="title"
              value={postTitle}
              onChange={this.onTextChange.bind(this, 'postTitle')}
              label="Post Title"
              variant="outlined"
            />
          </div>
          {this.getCurrentForm(currentTab, contentText, captionText)}
          <Button disabled={!this.validSubmission()} color="primary" type="submit" variant="contained">
            Submit
          </Button>
        </form>
        {responseMessage.length > 0 ? <div className="error-msg">{responseMessage}</div> : <></>}
      </div>
    );
  }
}

export default Upload;
