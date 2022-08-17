const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { Profile } = require('../models/profile');
const { Comment, Post, BlogPost, ImagePost } = require('../models/post');

const authenticate = require('./helpers/authentication');

const { mongo } = require('mongoose');
const { mongoChecker, isMongoError } = require('./helpers/mongo_helpers');

/*** Login and Logout routes ***/
router.post('/users/login', mongoChecker, async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const user = await User.validateLogin(username, password);
    if (!user) {
      res.status(400).send('Invalid credentials');
      return;
    }

    req.session.user = user;
    req.session.username = user.username;
    res.send({
      currentUser: user
    });
  } catch (error) {
    if (isMongoError(error)) {
      res.status(500).send();
    } else {
      console.log(error);
      res.status(400).send();
    }
  }
});

router.get('/users/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send();
    }
  });
});

router.get('/users/check-session', async (req, res) => {
  const env = process.env.NODE_ENV;
  const testUsername = process.env.TEST_USERNAME;
  if (env !== 'production') {
    const user = await User.getUser(testUsername, 'username');
    if (!user) {
      res.status(400).send();
    } else {
      res.send({ currentUser: user });
    }
  } else if (req.session.user) {
    res.send({ currentUser: req.session.user });
  } else {
    res.status(400).send();
  }
});

/*** General User routes ****************/
router.post('/api/users/create', mongoChecker, async (req, res) => {
  const { username, password, displayName, flags, profileIcon, links, about, other } = req.body;

  try {
    const user = await User.create({
      username,
      password,
      displayName,
      flags,
      profileIcon,
      createdAt: new Date()
    });

    const profile = await Profile.create({
      user: user.id,
      other,
      links,
      about
    });

    req.session.user = user;
    req.session.username = user.username;

    res.send({ currentUser: user, profile });
  } catch (error) {
    if (isMongoError(error)) {
      res.status(500).send('Internal server error');
    } else {
      console.log(error);
      res.status(400).send('Bad Request');
    }
  }
});

router.get('/api/users/all', mongoChecker, authenticate.adminAccess, async (req, res) => {
  try {
    const users = await User.find();
    res.send(users ? users : []);
  } catch (error) {
    if (isMongoError(error)) {
      res.status(500).send('Internal server error');
    } else {
      res.status(400).send('Bad Request');
    }
  }
});

router.get('/api/users/search/:query', mongoChecker, async (req, res) => {
  try {
    let userQuery = User.find({ username: { $regex: req.params.query, $options: 'i' } });

    let users = await userQuery.exec();

    users = users.filter((user) => !user.flags.get('deleted'));

    res.send(users ? users : []);
  } catch (error) {
    if (isMongoError(error)) {
      res.status(500).send('Internal server error');
    } else {
      console.log(error);
      res.status(400).send('Bad Request');
    }
  }
});

/** Specific User routes **/
router.put('/api/users/:username/update', mongoChecker, authenticate.adminAccess, async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.getUser(username, 'username');

    user.set(req.body);

    const updatedUser = await user.save();

    res.send({
      updatedUser: updatedUser
    });
  } catch (error) {
    if (isMongoError(error)) {
      res.status(500).send('Internal server error');
    } else {
      console.log(error);
      res.status(400).send('Bad Request');
    }
  }
});

router.post('/api/users/:username/delete', mongoChecker, authenticate.adminAccess, async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.getUser(username, 'username');

    await BlogPost.deleteMany({ user: user._id });
    await ImagePost.deleteMany({ user: user._id });

    user.flags.set('deleted', true);

    await user.save();

    res.send(user);
  } catch (error) {
    if (isMongoError(error)) {
      res.status(500).send('Internal server error');
    } else {
      console.log(error);
      res.status(400).send('Bad Request');
    }
  }
});

router.get('/api/users/:username/profile', mongoChecker, async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.aggregate([
      { $match: { username: username } },
      {
        $lookup: {
          from: 'profiles',
          localField: '_id',
          foreignField: 'user',
          as: 'profile'
        }
      },
      { $unwind: '$profile' }
    ]);

    if (!user.length) {
      res.status(404).send('Not found');
    } else if (user.length !== 1) {
      // something went seriously wrong
      res.status(400).send('Bad Request');
    } else {
      const returnedUser = user[0];
      if (returnedUser.flags.deleted) {
        res.status(400).send('deleted user');
        return;
      }

      returnedUser.following = req.user
        ? (await User.findById(req.user._id)).subscriptions.includes(returnedUser._id)
        : false;
      const posts = await Post.aggregate([
        { $match: { user: returnedUser._id } },
        {
          $addFields: {
            numLikes: { $size: '$likedBy' }
          }
        },
        { $sort: { timestamp: -1 } },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $lookup: {
            from: 'posts',
            localField: '_id',
            foreignField: 'postId',
            as: 'comments'
          }
        }
      ]);
      for (const post of posts) {
        post.comments = await Comment.find({ postId: post._id });
      }
      returnedUser.posts = posts;
      res.send({ user: returnedUser });
    }
  } catch (e) {
    if (isMongoError(e)) {
      res.status(500).send('Internal server error');
    } else {
      console.log(e);
      res.status(400).send('Bad Request');
    }
  }
});

router.post('/api/users/:username/follow', mongoChecker, authenticate.userAccess, async (req, res) => {
  try {
    const { username } = req.params;
    const followUser = await User.findById(req.params.username);
    if (followUser.flags.get('deleted')) {
      res.status(400).send('Deleted User');
      return;
    }
    if (!req.user.subscriptions) {
      req.user.subscriptions = [];
    }
    let nowFollowing;
    if (req.user.subscriptions.includes(followUser._id)) {
      req.user.subscriptions.splice(req.user.subscriptions.indexOf(followUser._id));
      nowFollowing = false;
    } else {
      req.user.subscriptions.push(followUser._id);
      nowFollowing = true;
    }

    req.user.save().then(() => res.send({ nowFollowing }));
  } catch (e) {
    if (isMongoError(e)) {
      res.status(500).send('Internal server error');
    } else {
      console.log(e);
      res.status(400).send('Bad Request');
    }
  }
});

router.get('/api/users/:username/get', mongoChecker, async (req, res) => {
  const username = req.params.username;
  try {
    const user = await User.find({ username: username }).select('subscriptions username displayName createdAt');

    if (user.flags.get('deleted')) {
      res.status(400).send('Deleted User');
    } else {
      res.send(user);
    }
  } catch (e) {
    if (isMongoError(e)) {
      res.status(500).send('Internal server error');
    } else {
      console.log(e);
      res.status(400).send('Bad Request');
    }
  }
});

// export the router
module.exports = router;
