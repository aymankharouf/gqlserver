const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ordering: Number,
  isLeaf: Boolean,
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories'
  }
})

module.exports = mongoose.model('Category', categorySchema)