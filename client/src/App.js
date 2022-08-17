//React Imports
import React from 'react';
import { Redirect, Route, Switch, BrowserRouter, useParams } from 'react-router-dom';

// Pages
import Header from 'components/Header/Header';
import Dashboard from 'components/Dashboard/Dashboard';
import Login from 'components/Login/Login';
import Explore from 'components/Explore/Explore';
import Search from 'components/Search/Search';
import Upload from 'components/Upload/Upload';
import Admin from 'components/Admin/Admin';
import PostPage from 'components/PostComponents/PostPage/PostPage';
import ProfilePage from 'components/ProfileComponents/ProfilePage/ProfilePage';

// Actions
import { checkSession } from './actions/user';

// Styling
import './App.css';

// Testing
import testState from './test/state';

class App extends React.Component {
  constructor(props) {
    super(props);
    checkSession(this);
  }

  state = {
    loggedIn: null // TODO: should be set to false to simulate auth
  };

  render() {
    const { loggedIn } = this.state;
    return (
      <div>
        <BrowserRouter>
          <Header appState={this.state} app={this} loggedIn={loggedIn} />
          <Switch>
            {/* Similar to a switch statement - shows the component depending on the URL path */}
            {/* Each Route below shows a different component depending on the exact path in the URL  */}
            <Route exact path="/">
              {/*this.state.loggedIn ? <Redirect to="/dashboard" /> : <Redirect to="/explore" />)*/}
              <Explore appState={this.state} loggedIn={loggedIn} />
            </Route>
            <Route
              exact
              path="/search/:query"
              render={(props) => {
                return <Search query={props.match.params.query} responseMessage={null} loggedIn={loggedIn} />;
              }}
            />
            <Route exact path="/search">
              <Search responseMessage={null} loggedIn={loggedIn} />
            </Route>
            <Route exact path="/dashboard">
              {loggedIn ? <Dashboard appState={this.state} loggedIn={loggedIn} /> : <Redirect to="/login" />}
            </Route>
            <Route exact path="/upload">
              {loggedIn && loggedIn.flags.creator ? (
                <Upload appState={this.state} loggedIn={loggedIn} />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
            <Route exact path="/admin">
              {loggedIn && loggedIn.flags.admin ? (
                <Admin user={loggedIn} appState={this.state} loggedIn={loggedIn} />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
            <Route exact path="/post/:id">
              {loggedIn ? <PostPage post={null} loggedIn={loggedIn} /> : <Redirect to="/login" />}
            </Route>
            <Route
              exact
              path="/profile/:id"
              render={(props) => {
                if (loggedIn) {
                  if (props.match.params.id === 'me') {
                    return <ProfilePage loggedIn={loggedIn} responseMessage={null} />;
                  } else if (props.match.params.id === loggedIn.username) {
                    return <Redirect to="/profile/me" />;
                  }
                  return <ProfilePage loggedIn={loggedIn} responseMessage={null} />;
                }
                return <Redirect to="/login" />;
              }}
            />
            <Route
              exact
              path="/login"
              render={(props) => {
                if (loggedIn) {
                  return <Redirect to="/dashboard" />;
                }
                return <Login {...props} user={loggedIn} app={this} appState={this.state} />;
              }}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
