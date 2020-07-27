const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  mobile:{
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  notifications: [
    {
      id: String,
      title: String,
      message: String,
      status: String,
      time: String
    }
  ],
})

module.exports = mongoose.model('User', userSchema)

