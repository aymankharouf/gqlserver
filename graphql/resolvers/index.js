const postResolvers = require('./posts')
const userResolvers = require('./users')

const rootResolvers = {
  Query: {
    ...postResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation
  }
}

module.exports = rootResolvers