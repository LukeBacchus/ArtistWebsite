const { ObjectId } = require('mongodb');

module.exports = {
  getAll: async (type) => {
    return await Post.find({}).exec();
  },
  // Comment-specific
  getByParent: async function (parentID) {
    const Post = this;
    const parent = await Post.findById(parentID).exec();
    let response;
    switch (parent.type) {
      case 'comment':
        response = await Post.find({ parentId: new ObjectId(parentID) }).exec();
        break;
      case 'image':
      case 'blog':
        response = await Post.find({ postId: new ObjectId(parentID) }).exec();
        break;
      default:
        break;
    }

    if (!response) {
      return Promise.reject('Could not find post');
    } else {
      return response;
    }
  }
};
