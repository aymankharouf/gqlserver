const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  userName: {
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
})

module.exports = mongoose.model('User', userSchema)

