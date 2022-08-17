// some helpers for mongo
const mongoose = require('mongoose');

module.exports = {
  mongoChecker: (req, res, next) => {
    if (mongoose.connection.readyState != 1) {
      console.log('Issue with mongoose connection');
      res.status(500).send('Internal server error');
      return;
    } else {
      next();
    }
  },

  isMongoError: function (error) {
    return typeof error === 'object' && error !== null && error.name === 'MongoNetworkError';
  }
};
