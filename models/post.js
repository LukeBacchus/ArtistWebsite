const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const postSchemaOptions = { discriminatorKey: 'type' };

const postRoutes = require('./routeHelpers/post');

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId, // ObjectId associated with users who created the post
      required: true
    },
    title: {
      type: String,
      maxlength: 100,
      trim: true
    },
    content: [String], // For Image posts, this will be the Description of the post
    likedBy: [ObjectId], // ObjectId associated with users who liked the post
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  postSchemaOptions
);

PostSchema.statics.getTypes = () => ['blog', 'image', 'comment'];

for (route in postRoutes) {
  PostSchema.statics[route] = postRoutes[route];
}

const Post = mongoose.model('Post', PostSchema);

const BlogPost = Post.discriminator(
  'blog',
  new mongoose.Schema({
    embeddedImages: [
      {
        type: [String],
        required: true,
        trim: true
      }
    ]
  })
);

const ImagePost = Post.discriminator(
  'image',
  new mongoose.Schema({
    imageUrl: {
      type: String,
      required: true,
      trim: true
    },
    caption: {
      type: [String],
      maxlength: 300,
      trim: true
    },
    cloudId: {
      type: String,
      required: true
    }
  })
);

const Comment = Post.discriminator(
  'comment',
  new mongoose.Schema({
    parentId: {
      type: ObjectId, // ObjectId associated with post which this comment belongs to
      required: false
    },
    postId: {
      type: ObjectId,
      required: true
    }
  })
);

module.exports = { Post, BlogPost, ImagePost, Comment };
