const { AuthenticationError } = require('apollo-server')

const jwt = require('jsonwebtoken')
const { JWT_KEY } = require('../../config')

const checkAuth = (context) => {
  const authHeader = context.req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    if (token) {
      try {
        const user = jwt.verify(token, JWT_KEY)
        return user
      } catch (err) {
        throw new AuthenticationError('Invalid/expired token')
      }
    }
  }
  throw new AuthenticationError('Authentication Error')
}

module.exports = checkAuth