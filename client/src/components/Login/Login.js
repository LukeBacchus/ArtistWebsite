import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import { login, createUser } from '../../actions/user';
import './Login.css';

const TABS = [
  { label: 'Login', active: true },
  { label: 'Sign Up', active: false }
];

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.props.history.push('/login');
  }

  state = {
    usernameInput: '',
    passwordInput: '',
    displayNameInput: '',
    errorMessage: '',
    isLogin: true
  };

  componentDidMount() {
    document.title = `CAW | Login`;
  }

  textOnChange(inputKey, e) {
    this.setState({
      [inputKey]: e.target.value,
      errorMessage: ''
    });
  }

  renderForm(isLogin, usernameInput, passwordInput, displayNameInput) {
    let displayName;
    if (!isLogin) {
      displayName = (
        <div className="input">
          <TextField
            value={displayNameInput}
            onChange={this.textOnChange.bind(this, 'displayNameInput')}
            label="Display Name"
            variant="outlined"
          />
        </div>
      );
    }

    return (
      <>
        <div className="input">
          <TextField
            value={usernameInput}
            onChange={this.textOnChange.bind(this, 'usernameInput')}
            label="Username"
            variant="outlined"
          />
        </div>
        {displayName ? displayName : <></>}
        <div className="input">
          <TextField
            value={passwordInput}
            onChange={this.textOnChange.bind(this, 'passwordInput')}
            label="Password"
            type="password"
            variant="outlined"
          />
        </div>
      </>
    );
  }

  switchAuthMethod(isLogin) {
    if (isLogin === this.state.isLogin) return;
    this.setState({ isLogin, errorMessage: '' });
  }

  makeAuthRequest(isLogin, usernameInput, passwordInput, displayNameInput) {
    if (isLogin) {
      login({ username: usernameInput, password: passwordInput }, this, this.props.app);
    } else {
      createUser(
        { username: usernameInput, password: passwordInput, displayName: displayNameInput },
        this,
        this.props.app
      );
    }
  }

  render() {
    const { usernameInput, passwordInput, displayNameInput, errorMessage, isLogin } = this.state;
    return (
      <div className="login main container">
        <div className="login-content">
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
          {errorMessage ? <div id="error-message">{errorMessage}</div> : <></>}
          <form
            id="login-form"
            onKeyPress={(e) => {
              if (e.nativeEvent.key === 'Enter')
                this.makeAuthRequest(isLogin, usernameInput, passwordInput, displayNameInput);
            }}>
            {this.renderForm(isLogin, usernameInput, passwordInput)}
            <div id="action-btns">
              <div id="switch-btn">
                <a onClick={this.switchAuthMethod.bind(this, !isLogin)}>{isLogin ? 'New user?' : 'Returning user?'}</a>
              </div>
              <div id="login-btn">
                <Button
                  onClick={() => this.makeAuthRequest(isLogin, usernameInput, passwordInput, displayNameInput)}
                  variant="contained"
                  disabled={usernameInput.length === 0 || passwordInput.length === 0}>
                  Continue
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
