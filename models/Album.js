const mongoose = require('mongoose')
const { Schema } = mongoose

const albumSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  performer: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('album', albumSchema)
