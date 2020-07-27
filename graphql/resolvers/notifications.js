const { AuthenticationError, UserInputError } = require('apollo-server')
const Notification = require('../../models/notification')
const authCheck = require('./auth-check')

const notificationResolvers = {
  Query: {
    notifications: async (parent, args) => {
      try {
        const notifications = await Notification.find({'toUser': args.toUser})
        return notifications
      } catch (err) {
        throw new Error(err)
      }
    },
    notification: async (parent, args) => {
      try{
        if (!args.id.match(/^[0-9a-fA-F]{24}$/)) {
          throw new Error('Invalid ID');
        }
        const notification = await Notification.findById(args.id)
        if (notification) {
          return notification
        } else {
          throw new Error('notification not found')
        }
      } catch (err) {
        throw new Error(err)
      }
    }
  },
  Mutation: {
    createNotification: async (parent, args, context) => {
      if (args.title.trim() === '') {
        throw new Error('Title must be not empty')
      }
      if (args.message.trim() === '') {
        throw new Error('Message must be not empty')
      }
      if (args.toUserID.trim() === '') {
        throw new Error('receiver must be not empty')
      }
      const user = authCheck(context)
      const newNotification = new Notification({
        title: args.title,
        message: args.message,
        toUser: args.toUserID,
        fromUser: user.id,
        createdAt: new Date().toISOString()
      })
      const notification = await newNotification.save()
      return notification
    },
    deleteNotification: async (parent, args, context) => {
      try {
        const notification = await Notification.findById(args.id)
        const user = authCheck(context)
        if (user.id === notification.fromUser) {
          await notification.delete()
          return 'Notification deleted'
        } else {
          throw new AuthenticationError('Action not allowed')
        }
      } catch (err) {
        throw new Error(err)
      }
    },
  },
};

module.exports = notificationResolvers
