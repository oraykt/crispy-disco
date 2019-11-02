const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
  userName: String,
  userEmail: String
})

module.exports = mongoose.model('user', userSchema)
