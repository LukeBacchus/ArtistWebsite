import React from 'react';
import { Button, TextField } from '@material-ui/core';
import './AddComment.css';

class AddComment extends React.Component {
  state = {
    commentText: ''
  };

  onTextChange(e) {
    this.setState({
      commentText: e.target.value
    });
  }

  onSubmitComment(e) {
    e.preventDefault();
    this.props.submitContent(this.state.commentText);
    this.setState({
      commentText: ''
    });
  }

  render() {
    const { commentText } = this.state;
    return (
      <div className="add-comment-container">
        <form>
          <TextField
            value={commentText}
            onChange={this.onTextChange.bind(this)}
            label="Add Comment"
            multiline
            rows={6}
            variant="outlined"
            className="input"
          />
          <Button
            disabled={commentText.length === 0}
            onClick={this.onSubmitComment.bind(this)}
            color="primary"
            type="submit"
            variant="contained">
            Comment
          </Button>
        </form>
      </div>
    );
  }
}

export default AddComment;
