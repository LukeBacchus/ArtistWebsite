const bcrypt = require('bcryptjs');

module.exports = {
  validateLogin: async function (username, password) {
    const User = this;
    const user = await User.findOne({ username: username });

    if (!user || user.flags.get('deleted')) {
      return;
    }

    const passwordMatched = bcrypt.compareSync(password, user.password);

    if (!passwordMatched) {
      return;
    }

    return user;
  },
  getUser: async function (identification, request) {
    const User = this;
    let response;
    switch (request) {
      case 'id':
        response = await User.findById(identification).exec();
        break;
      case 'username':
        response = await User.findOne({ username: identification }).exec();
        break;
    }

    return response;
  }
};
