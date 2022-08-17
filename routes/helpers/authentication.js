const { User } = require('../../models/user');

const { Post } = require('../../models/post');

module.exports = {
  postMod: (req, res, next) => {
    /* Demo purposes */
    if (req.get('Authorization') === 'Basic YWRtaW46YWRtaW4=') {
      req.user = User.getUser('admin', 'username');
      next();
    } else if (req.get('Authorization') === 'Basic dXNlcjp1c2Vy') {
      req.user = User.getUser('user', 'username');
      next();
    }

    const env = process.env.NODE_ENV;
    const testUsername = process.env.TEST_USERNAME;
    let userpromise;
    if (env !== 'production') {
      userpromise = User.getUser(testUsername, 'username');
    } else if (req.session.user) {
      userpromise = User.findById(req.session.user._id);
    } else {
      res.status(401).send('No Session User to Authorize');
    }

    Post.findById(req.body.post || req.params.id)
      .then((post) => {
        userpromise.then((user) => {
          if (!user) {
            res.status(402).send('Cannot find session user');
          } else if (!post) {
            res.status(402).send('Cannot find given post');
          } else if (user.isMod() || user._id === post.user) {
            req.user = user;
            next();
          } else {
            res.status(401).send('Unauthorized');
          }
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(401).send('Authorization Error');
      });
  },
  postCreate: (req, res, next) => {
    if (req.get('Authorization') === 'Basic YWRtaW46YWRtaW4=') {
      req.user = User.getUser('admin', 'username');
      next();
    } else if (req.get('Authorization') === 'Basic dXNlcjp1c2Vy') {
      req.user = User.getUser('user', 'username');
      next();
    }

    const env = process.env.NODE_ENV;
    const testUsername = process.env.TEST_USERNAME;
    let userpromise;
    if (env !== 'production') {
      userpromise = User.getUser(testUsername, 'username');
    } else if (req.session.user) {
      userpromise = User.findById(req.session.user._id);
    } else {
      res.status(401).send('No Session User to Authorize');
    }

    userpromise
      .then((user) => {
        if (!user) {
          res.status(402).send('Cannot find session user');
        } else if (user.flags.get('creator')) {
          req.user = user;
          next();
        } else {
          res.status(401).send('Unauthorized');
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(401).send('Authorization Error');
      });
  },
  userMod: (req, res, next) => {
    if (req.get('Authorization') === 'Basic YWRtaW46YWRtaW4=') {
      req.user = User.getUser('admin', 'username');
      next();
    } else if (req.get('Authorization') === 'Basic dXNlcjp1c2Vy') {
      req.user = User.getUser('user', 'username');
      next();
    }

    const env = process.env.NODE_ENV;
    const testUsername = process.env.TEST_USERNAME;
    const username = req.body.username || req.params.username;

    let userpromise;
    if (env !== 'production') {
      userpromise = User.getUser(testUsername, 'username');
    } else if (req.session.user) {
      userpromise = User.findById(req.session.user._id);
    } else {
      res.status(401).send('No Session User to Authorize');
    }

    User.findOne({ username: req.body.username })
      .then((targetuser) => {
        userpromise.then((user) => {
          if (!user) {
            res.status(402).send('Cannot find session user');
          } else if (!targetuser) {
            res.status(402).send('Cannot find user with given username');
          } else if (user.isMod() || user._id === targetuser._id) {
            req.user = user;
            next();
          } else {
            res.status(401).send('Unauthorized');
          }
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(401).send('Authorization Error');
      });
  },
  userAccess: (req, res, next) => {
    if (req.get('Authorization') === 'Basic YWRtaW46YWRtaW4=') {
      req.user = User.getUser('admin', 'username');
      next();
    } else if (req.get('Authorization') === 'Basic dXNlcjp1c2Vy') {
      req.user = User.getUser('user', 'username');
      next();
    }

    const env = process.env.NODE_ENV;
    const testUsername = process.env.TEST_USERNAME;
    let userpromise;
    if (env !== 'production') {
      userpromise = User.getUser(testUsername, 'username');
    } else if (req.session.user) {
      userpromise = User.findById(req.session.user._id);
    } else {
      res.status(401).send('No Session User to Authorize');
    }

    userpromise
      .then((user) => {
        if (!user) {
          res.status(401).send('Unauthorized');
        } else {
          req.user = user;
          next();
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(401).send('Authorization Error');
      });
  },
  adminAccess: (req, res, next) => {
    if (req.get('Authorization') === 'Basic YWRtaW46YWRtaW4=') {
      req.user = User.getUser('admin', 'username');
      next();
    } else if (req.get('Authorization') === 'Basic dXNlcjp1c2Vy') {
      req.user = User.getUser('user', 'username');
      next();
    }

    const env = process.env.NODE_ENV;
    const testUsername = process.env.TEST_USERNAME;
    let userpromise;
    if (env !== 'production') {
      userpromise = User.getUser(testUsername, 'username');
    } else if (req.session.user) {
      userpromise = User.findById(req.session.user._id);
    } else {
      res.status(401).send('No Session User to Authorize');
    }

    userpromise
      .then((user) => {
        if (!user || user.isAdmin()) {
          req.user = user;
          next();
        } else {
          res.status(401).send('Unauthorized');
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(401).send('Authorization Error');
      });
  }
};
