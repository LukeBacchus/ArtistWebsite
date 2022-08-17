const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

const userRoutes = require('./routeHelpers/user');

const validFlags = ['admin', 'creator', 'moderator', 'deleted'];

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlegth: 1,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlegth: 1,
    trim: true
  },
  displayName: {
    type: String,
    minlength: 1,
    trim: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  flags: {
    type: Map,
    of: Boolean
  },
  profileIcon: String,
  subscriptions: [ObjectId] // list of user id's of subscriptions
});

UserSchema.pre('save', function (next) {
  const user = this; // binds this to User document instance

  if (user.isModified('flags')) {
    // make default flags false
    if (!user.flags) {
      user.flags = new Map();
    }
    user.flags.set('creator', user.flags.get('creator') || false);
    user.flags.set('admin', user.flags.get('admin') || false);
    user.flags.set('moderator', user.flags.get('moderator') || false);
    user.flags.set('deleted', user.flags.get('deleted') || false);

    for (flag in user.flags.keys()) {
      if (!(flag in validFlags)) {
        throw new Error('invalid flag specified');
      }
    }
  }

  if (user.isModified('password')) {
    // generate salt and hash the password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

for (route in userRoutes) {
  UserSchema.statics[route] = userRoutes[route];
}

UserSchema.method('isMod', function () {
  return this.flags.get('admin') || this.flags.get('moderator');
});

UserSchema.method('isAdmin', function () {
  return this.flags.get('admin');
});

const User = mongoose.model('User', UserSchema);
module.exports = { User };
