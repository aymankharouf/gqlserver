const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server-express')

const User = require('../../models/user')
const { JWT_KEY } = require('../../config')
const { validateRegisterInputs, validateLoginInput } = require('../../validators')

const generateToken = user => jwt.sign({
  id: user._id,
  email: user.email,
  username: user.username,
}, JWT_KEY, {expiresIn: '1h'})

const userResolvers = {
  Mutation: {
    login: async (parent, args) => {
      const errors = validateLoginInput(args.username, args.password)
      if (Object.keys(errors).length > 0) {
        throw new UserInputError('Errors', {errors})
      }
      const user = await User.findOne({username: args.username})
      if (!user) {
        throw new UserInputError('user not found')
      }
      const match = await bcrypt.compare(args.password, user.password)
      if (!match) {
        throw new UserInputError('wrong credintioals')
      }
      return {
        ...user._doc,
        id: user._id,
        token: generateToken(user)
      }  
    },
    register: async (parent, args) => {
      const errors = validateRegisterInputs(args.registerInput.username, args.registerInput.password, args.registerInput.confirmPassword, args.registerInput.email)
      if (Object.keys(errors).length > 0) {
        throw new UserInputError('Errors', {errors})
      }
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
      const user = await newUser.save()
      return {
        ...user._doc,
        id: user._id,
        token: generateToken(user)
      }  
      
    }
  },
};

module.exports = userResolvers