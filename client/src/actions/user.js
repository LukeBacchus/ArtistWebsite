// Functions to help with user actions.
const server = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000'; //TODO: set this to empty string when deploying

// Send a request to check if a user is logged in through the session cookie
export const checkSession = (app) => {
  const url = `${server}/users/check-session`;

  fetch(url)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then((json) => {
      if (json && json.currentUser) {
        app.setState({ loggedIn: json.currentUser });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getUsers = (adminComp) => {
  const url = `${server}/api/users/all`;

  fetch(url)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then((json) => {
      adminComp.setState({ allUsers: json });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const deleteUser = (un) => {
  const request = new Request(`${server}/api/users/${un}/delete`, {
    method: 'post'
  });
  fetch(request)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else if (res.status === 400) {
        return { errorMessage: 'Not a valid user' };
      }
      return { errorMessage: 'Something went wrong' };
    })
    .catch((error) => {
      console.log(error);
    });
};

// A functon to update the login form state
export const updateLoginForm = (loginComp, field) => {
  const value = field.value;
  const name = field.name;

  loginComp.setState({
    [name]: value
  });
};

export const createUser = (userPayload, loginComp, app) => {
  // Create our request constructor with all the parameters we need
  const request = new Request(`${server}/api/users/create`, {
    method: 'post',
    body: JSON.stringify(userPayload),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  });

  // Send the request with fetch()
  fetch(request)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else if (res.status === 400) {
        return { errorMessage: 'Username already in use' };
      }

      return { errorMessage: 'Something went wrong' };
    })
    .then((json) => {
      if (json.currentUser !== undefined) {
        app.setState({ loggedIn: json.currentUser });
        loginComp.props.history.push('/dashboard');
      } else {
        loginComp.setState({
          errorMessage: json.errorMessage
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getUserProfileByUsername = (userId, comp) => {
  const url = `${server}/api/users/${userId}/profile`;
  fetch(url)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return { responseMessage: 'Something went wrong' };
      }
    })
    .then((json) => {
      comp.setState({ ...json, responseMessage: null, following: json.user?.following });
    })
    .catch((err) => {
      comp.setState({ responseMessage: 'Something went wrong' });
    });
};

export const searchUsers = async (query, comp) => {
  try {
    const res = await fetch(`${server}/api/users/search/${query}`);
    if (res.status === 200) {
      const users = await res.json();
      console.log(users);
      comp.setState({
        returnedUsers: users
      });
    }
  } catch (error) {
    console.log(error);
    comp.setState({ responseMessage: 'Something went wrong' });
  }
};

// A function to send a POST request with the user to be logged in
export const login = (loginPayload, loginComp, app) => {
  // Create our request constructor with all the parameters we need
  const request = new Request(`${server}/users/login`, {
    method: 'post',
    body: JSON.stringify(loginPayload),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  });

  // Send the request with fetch()
  fetch(request)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else if (res.status === 400) {
        return { errorMessage: 'Invalid credentials' };
      }

      return { errorMessage: 'Something went wrong' };
    })
    .then((json) => {
      if (json.currentUser !== undefined) {
        app.setState({ loggedIn: json.currentUser });
        loginComp.props.history.push('/dashboard');
      } else {
        loginComp.setState({
          errorMessage: json.errorMessage
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// A function to send a GET request to logout the current user
export const logout = (app, comp) => {
  const url = `${server}/users/logout`;

  fetch(url)
    .then((res) => {
      app.setState({
        loggedIn: null
      });
      if (!comp.props.location.pathname.includes('login')) {
        comp.props.history.push('/login');
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
