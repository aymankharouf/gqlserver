const Post = require('../../models/post')

const postResolvers = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find()
        return posts
      } catch (err) {
        throw new Error(err)
      }
    },
  },
};

module.exports = postResolvers