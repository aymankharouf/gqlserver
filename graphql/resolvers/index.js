const postResolvers = require('./posts')
const userResolvers = require('./users')

const rootResolvers = {
  Post: {
    likesCount: parent => parent.likes.length
  },
  Query: {
    ...postResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation
  },
  Subscription: {
    ...postResolvers.Subscription
  }
}

module.exports = rootResolvers