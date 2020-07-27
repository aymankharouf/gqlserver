const notificationResolvers = require('./notifications')
const userResolvers = require('./users')
const categoryResolvers = require('./categories')

const rootResolvers = {
  Query: {
    ...notificationResolvers.Query,
    ...categoryResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...notificationResolvers.Mutation,
    ...categoryResolvers.Mutation
  }
}

module.exports = rootResolvers