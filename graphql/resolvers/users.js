const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server-express')

const User = require('../../models/user')
const { JWT_KEY } = require('../../config')

const userResolvers = {
  Mutation: {
    register: async (parent, args) => {
      const found = await User.findOne({$or: [{username: args.registerInput.username}, {email: args.registerInput.email}]})
      if (found) {
        throw new UserInputError('user already exists')
      }
      const password = await bcrypt.hash(args.registerInput.password, 12)
      const newUser = new User({
        email: args.registerInput.email,
        username: args.registerInput.username,
        password,
        createdAt: new Date().toISOString()
      })
      const result = await newUser.save()
      const token = jwt.sign({
        id: result._id,
        email: result.email,
        username: result.username,
      }, JWT_KEY, {expiresIn: '1h'})
      return {
        ...result._doc,
        id: result._id,
        token
      }  
    }
  },
};

module.exports = userResolvers