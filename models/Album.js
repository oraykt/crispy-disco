const mongoose = require('mongoose')
const { Schema } = mongoose

const albumSchema = new Schema({
  title: String,
  performer: String,
  cost: Number
})

module.exports = mongoose.model('album', albumSchema)
