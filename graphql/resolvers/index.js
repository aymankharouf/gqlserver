const postResolver = require('./posts')
const userResolver = require('./users')

const rootResolvers = {
  Query: {
    ...postResolver.Query
  },
  Mutation: {
    ...userResolver.Mutation
  }
}

module.exports = rootResolvers