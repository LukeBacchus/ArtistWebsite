const express = require('express');
const router = express.Router();

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const { User } = require('../models/user');
const { Post, BlogPost, ImagePost, Comment } = require('../models/post');

const authenticate = require('./helpers/authentication');
const { mongoChecker, isMongoError } = require('./helpers/mongo_helpers');
const { ObjectID } = require('mongodb');

const cloudinary = require('cloudinary');

if (process.env.NODE_ENV !== 'production') {
  const secrets = require('../secrets.json');
  cloudinary.config(secrets.cloudinary);
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

/*** Creation routes ***/
router.post('/api/posts/blog', mongoChecker, multipartMiddleware, authenticate.postCreate, async (req, res) => {
  try {
    BlogPost.create({
      user: req.user._id,
      ...req.body
    }).then((post) => res.send(post));
  } catch (e) {
    if (isMongoError(e)) {
      res.status(500).send('Internal server error');
    } else {
      console.log(e);
      res.status(400).send('Bad Request');
    }
  }
});

router.post('/api/posts/comment', mongoChecker, authenticate.userAccess, async (req, res) => {
  try {
    const comment = await Comment.create({
      user: req.user._id,
      ...req.body
    });
    const parentPostId = comment.postId;
    const post = await Post.aggregate([
      { $match: { _id: new ObjectID(parentPostId) } },
      {
        $addFields: {
          numLikes: { $size: '$likedBy' }
        }
      },
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

    if (!post.length) {
      res.status(404).send('Not found');
    } else if (post.length !== 1) {
      // something went seriously wrong
      res.status(400).send('Bad Request');
    } else {
      const updatedPost = post[0];
      for (const comment of updatedPost.comments) {
        comment.user = await User.findById(comment.user);
      }
      res.send({ updatedPost });
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

router.post('/api/posts/image', mongoChecker, multipartMiddleware, authenticate.postCreate, async (req, res) => {
  try {
    if (process.env.NODE_ENV !== 'serverdev' && (!req.files || Object.keys(req.files).length === 0)) {
      return res.status(400).send('No images were uploaded.');
    }

    cloudinary.v2.uploader.upload(
      req.files.image.path,
      {
        folder: req.user._id,
        crop: 'limit',
        tags: 'user-upload',
        width: 3000,
        height: 3000
      },
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).send('Error uploading image to server');
        } else {
          ImagePost.create({
            imageUrl: result.url,
            cloudId: result.public_id,
            user: req.user._id,
            ...req.body
          }).then(
            (saveRes) => {
              res.send(saveRes);
            },
            (error) => {
              console.log(error);
              res.status(500).send('Internal server error');
            }
          );
        }
      }
    );
  } catch (e) {
    if (isMongoError(e)) {
      res.status(500).send('Internal server error');
    } else {
      console.log(e);
      res.status(400).send('Bad Request');
    }
  }
});

/*** Specific post routes ***/
router.get('/api/posts/:id/get', mongoChecker, async (req, res) => {
  try {
    const post = await Post.aggregate([
      { $match: { _id: new ObjectID(req.params.id) } },
      {
        $addFields: {
          numLikes: { $size: '$likedBy' }
        }
      },
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

    if (!post.length) {
      res.status(404).send('Not found');
    } else if (post.length !== 1) {
      // something went seriously wrong
      res.status(400).send('Bad Request');
    } else {
      const returnedPost = post[0];
      for (const comment of returnedPost.comments) {
        comment.user = await User.findById(comment.user);
      }
      res.send({ post: returnedPost });
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

router.post('/api/posts/:id/update', mongoChecker, authenticate.userAccess, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.set(req.body);
    await post.save();

    const updatedPost = await Post.aggregate([
      { $match: { _id: new ObjectID(req.params.id) } },
      {
        $addFields: {
          numLikes: { $size: '$likedBy' }
        }
      },
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
    res.send({ updatedPost: updatedPost[0] });
  } catch (e) {
    if (isMongoError(e)) {
      res.status(500).send('Internal server error');
    } else {
      console.log(e);
      res.status(400).send('Bad Request');
    }
  }
});

router.post('/api/posts/:id/delete', mongoChecker, authenticate.postMod, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).exec();

    if (!post) {
      res.status(400).send('Post not found');
    } else if (post.type === 'image') {
      cloudinary.v2.uploader.destroy(post.cloudId, { resource_type: 'image' }, (error, cloudres) => {
        if (error) {
          console.log(error);
          res.status(500).send('Cloud server error');
        } else if (cloudres.result === 'not found') {
          res.status(500).send('Image does not exist on cloud');
        } else {
          console.log('Successfully destroyed');
          Post.findByIdAndDelete(post._id)
            .then(() => res.send())
            .catch((error) => {
              console.log(error);
              res.status(500).send('Internal server error');
            });
        }
      });
    } else {
      Post.findByIdAndDelete(post._id)
        .then(() => res.send())
        .catch((error) => {
          console.log(error);
          res.status(500).send('Internal server error');
        });
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

router.get('/api/posts/:id/replies', mongoChecker, async (req, res) => {
  try {
    const posts = await Post.getByParent(req.params.id);
    res.send(posts);
  } catch (e) {
    if (isMongoError(e)) {
      res.status(500).send('Internal server error');
    } else {
      console.log(e);
      res.status(400).send('Bad Request');
    }
  }
});

router.post('/api/posts/:id/like', mongoChecker, authenticate.userAccess, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likedBy) {
      post.likedBy = [];
    }
    let liked;
    if (post.likedBy.includes(req.user._id)) {
      liked = false;
      post.likedBy.splice(post.likedBy.indexOf(req.user._id));
    } else {
      liked = true;
      post.likedBy.push(req.user._id);
    }

    const updatedPost = await post.save();

    res.send({ liked, updatedPost });
  } catch (e) {
    if (isMongoError(e)) {
      res.status(500).send('Internal server error');
    } else {
      console.log(e);
      res.status(400).send('Bad Request');
    }
  }
});

/*** General Post routes ***/
/**
 * Return all posts by default. If query has this format `?include=<post types to include`,
 * return the corresponding type of post(s)
 *
 * eg. ?include=blog,image -> indicates to only return blog and image posts.
 */
router.get('/api/posts/all', mongoChecker, async (req, res) => {
  const include = req.query.include;
  try {
    let includeTypes = Post.getTypes();
    if (include) {
      includeTypes = include.split(',');
    }

    const posts = await Post.aggregate([
      { $match: { type: { $in: includeTypes } } },
      {
        $addFields: {
          numLikes: { $size: '$likedBy' }
        }
      },
      { $sort: { numLikes: -1, timestamp: -1 } },
      { $limit: 20 },
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
      },
      { $sort: { numLikes: -1, timestamp: -1 } }
    ]);
    res.send(posts);
  } catch (e) {
    if (isMongoError(e)) {
      res.status(500).send('Internal server error');
    } else {
      console.log(e);
      res.status(400).send('Bad Request');
    }
  }
});

router.get('/api/posts/subscribed', mongoChecker, authenticate.userAccess, async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $match: {
          user: { $in: req.user.subscriptions },
          type: { $in: ['image', 'blog'] }
        }
      },
      {
        $addFields: {
          numLikes: { $size: '$likedBy' }
        }
      },
      { $sort: { timestamp: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'post',
          localField: 'postId',
          foreignField: '_id',
          as: 'comments'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' }
    ]);

    res.send(posts ? posts : []);
  } catch (e) {
    if (isMongoError(e)) {
      res.status(500).send('Internal server error');
    } else {
      console.log(e);
      res.status(400).send('Bad Request');
    }
  }
});

router.get('/api/posts/search/:query', mongoChecker, async (req, res) => {
  try {
    Post.find({ title: { $regex: req.params.query, $options: 'i' } }).then((posts) => res.send(posts ? posts : []));
  } catch (error) {
    if (isMongoError(error)) {
      res.status(500).send('Internal server error');
    } else {
      console.log(error);
      res.status(400).send('Bad Request');
    }
  }
});

// export the router
module.exports = router;
