const { AuthenticationError, UserInputError } = require('apollo-server')

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
      conext.pubsub.publish('NEW_POST', {
        newPost: post
      })
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
    },
    createComment: async (parent, args, context) => {
      const user = authCheck(context)
      const post = await Post.findById(args.postId)
      if (args.body.trim() === '') {
        throw new UserInputError('Empty comment')
      }
      if (post) {
        post.comments.unshift({
          body: args.body,
          username: user.username,
          createdAt: new Date().toISOString()
        })
        await post.save()
        return post
      } else {
        throw new UserInputError('Post not found')
      }
    },
    deleteComment: async (parent, args, context) => {
      const user = authCheck(context)
      const post = await Post.findById(args.postId)
      if (post) {
        const commentIndex = post.comments.findIndex(c => c.id === args.commentId)
        if (post.comments[commentIndex].username === user.username) {
          post.comments.splice(commentIndex, 1)
          await post.save()
          return post
        } else {
          throw new AuthenticationError('Action not allowed')
        }
      } else {
        throw new UserInputError('Post not found')
      }
    },
    likePost: async (parent, args, context) => {
      const user = authCheck(context)
      const post = await Post.findById(args.postId)
      if (post) {
        const found = post.likes.findIndex(l => l.username === user.username)
        if (found > -1) {
          post.likes.splice(found, 1)
        } else {
          post.likes.push({
            username: user.username,
            createdAt: new Date().toISOString()
          })
        }
        await post.save()
        return post
      } else {
        throw new UserInputError('Post not found')
      }
    }
  },
  Subscription: {
    newPost: {
      subscribe: (parent, args, context) => context.pubsub.asyncIterator('NEW_POST')
    }
  }
};

module.exports = postResolvers
