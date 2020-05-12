const { AuthenticationError } = require('apollo-server-express')

const Post = require('../../models/post')
const authCheck = require('./auth-check')

const postResolvers = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find().sort({createdAt: -1})
        return posts
      } catch (err) {
        throw new Error(err)
      }
    },
    getPost: async (parent, args) => {
      try{
        if (!args.id.match(/^[0-9a-fA-F]{24}$/)) {
          throw new Error('Invalid ID');
        }
        const post = await Post.findById(args.id)
        if (post) {
          return post
        } else {
          throw new Error('post not found')
        }
      } catch (err) {
        throw new Error(err)
      }
    }
  },
  Mutation: {
    createPost: async (parent, args, context) => {
      const user = authCheck(context)
      const newPost = new Post({
        body: args.body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      })
      const post = await newPost.save()
      return post
    },
    deletePost: async (parent, args, context) => {
      try {
        const post = await Post.findById(args.id)
        const user = authCheck(context)
        if (user.username === post.username) {
          await post.delete()
          return 'Post deleted'
        } else {
          throw new AuthenticationError('Action not allowed')
        }
      } catch (err) {
        throw new Error(err)
      }
    }
  }
};

module.exports = postResolvers
