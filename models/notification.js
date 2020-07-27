const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  status: String,
  createdAt: String,
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  }
})

module.exports = mongoose.model('Notification', notificationSchema)