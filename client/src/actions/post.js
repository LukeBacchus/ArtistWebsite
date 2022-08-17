// Functions to help with post actions.
const server = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000'; //TODO: set this to empty string when deploying

// Send a request to check if a user is logged in through the session cookie
export const createBlogPost = (postPayload, uploadComp) => {
  const request = new Request(`${server}/api/posts/blog`, {
    method: 'post',
    body: JSON.stringify(postPayload),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  });

  fetch(request)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then((json) => {
      if (json) {
        uploadComp.setState({
          responseMessage: 'Successfully uploaded',
          postTitle: '',
          imageURL: '',
          contentText: ''
        });
      } else {
        uploadComp.setState({ responseMessage: 'Something went wrong' });
      }
    })
    .catch((error) => {
      console.log(error);
      uploadComp.setState({ responseMessage: 'Something went wrong' });
    });
};

export const createImagePost = (postPayload, uploadComp, form) => {
  const request = new Request(`${server}/api/posts/image`, {
    method: 'post',
    body: postPayload
  });

  fetch(request)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then((json) => {
      if (json) {
        uploadComp.setState({
          responseMessage: 'Successfully uploaded',
          postTitle: '',
          imageURL: '',
          contentText: '',
          captionText: ''
        });
        form.reset();
      } else {
        uploadComp.setState({ responseMessage: 'Something went wrong' });
      }
    })
    .catch((error) => {
      console.log(error);
      uploadComp.setState({ responseMessage: 'Something went wrong' });
    });
};

export const addComment = (commentPayload, comp) => {
  const request = new Request(`${server}/api/posts/comment`, {
    method: 'post',
    body: JSON.stringify(commentPayload),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  });

  fetch(request)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then((json) => {
      if (json.updatedPost) {
        comp.setState({
          post: json.updatedPost
        });
      } else {
        comp.setState({ responseMessage: 'Something went wrong' });
      }
    })
    .catch((error) => {
      console.log(error);
      comp.setState({ responseMessage: 'Something went wrong' });
    });
};

export const modifyPostById = (postId, postPayload, comp) => {
  const request = new Request(`${server}/api/posts/${postId}/update`, {
    method: 'post',
    body: JSON.stringify(postPayload),
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  });

  fetch(request)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        alert('Could not save post');
        return Promise.reject();
      }
    })
    .then((json) => {
      const post = json.updatedPost;
      if (post) {
        comp.setState({
          ...post,
          numComments: post.comments.length,
          postId: post._id,
          editMode: false
        });
      } else {
        alert('Could not save post');
        return Promise.reject();
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const deletePostById = (postId, comp) => {
  const request = new Request(`${server}/api/posts/${postId}/delete`, {
    method: 'post',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  });

  fetch(request)
    .then((res) => {
      if (res.status === 200) {
        alert('Deleted post successfully');
      } else {
        alert('Could not delete post');
        return Promise.reject();
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getAllPosts = async (comp) => {
  try {
    const res = await fetch(`${server}/api/posts/all?include=image,blog`);
    if (res.status === 200) {
      const posts = await res.json();
      if (posts.length) {
        comp.setState({
          posts
        });
      } else {
        comp.setState({ responseMessage: 'Something went wrong' });
      }
    }
  } catch (error) {
    console.log(error);
    comp.setState({ responseMessage: 'Something went wrong' });
  }
};

export const getAllSubscribedPosts = async (comp) => {
  try {
    const res = await fetch(`${server}/api/posts/subscribed`);
    if (res.status === 200) {
      const posts = await res.json();
      if (posts.length) {
        comp.setState({
          posts
        });
      } else {
        comp.setState({ responseMessage: 'Something went wrong' });
      }
    }
  } catch (error) {
    console.log(error);
    comp.setState({ responseMessage: 'Something went wrong' });
  }
};

export const searchPosts = async (query, comp) => {
  try {
    const res = await fetch(`${server}/api/posts/search/${query}`);
    if (res.status === 200) {
      const posts = await res.json();
      comp.setState({
        returnedPosts: posts
      });
    }
  } catch (error) {
    console.log(error);
    comp.setState({ responseMessage: 'Something went wrong' });
  }
};

export const getPostById = async (postId, comp) => {
  try {
    const res = await fetch(`${server}/api/posts/${postId}/get`);
    if (res.status === 200) {
      comp.setState({
        post: (await res.json()).post
      });
      return;
    }
    comp.setState({
      responseMessage: 'Something went wrong!'
    });
  } catch (e) {
    comp.setState({
      responseMessage: 'Something went wrong!'
    });
  }
};

export const toggleFollowUserById = (userId, comp) => {
  const request = new Request(`${server}/api/users/${userId}/follow`, {
    method: 'post',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  });
  fetch(request)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return Promise.reject('Could not follow user');
      }
    })
    .then((json) => {
      if (json) {
        comp.setState({
          following: json.nowFollowing
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const toggleLikePostById = (postId, comp) => {
  const request = new Request(`${server}/api/posts/${postId}/like`, {
    method: 'post',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  });
  fetch(request)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return Promise.reject('Could not like post');
      }
    })
    .then((json) => {
      if (json.updatedPost) {
        comp.setState(json);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
