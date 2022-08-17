const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const profileSchemaOptions = { discriminatorKey: 'type' };

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId, // ObjectId associated with users who created the post
      required: true
    },
    about: {
      type: [String],
      required: true
    },
    other: {
      type: [String],
      required: true
    },
    links: {
      type: [String],
      required: true
    }
  },
  profileSchemaOptions
);

const Profile = mongoose.model('Profile', ProfileSchema);
module.exports = { Profile };
