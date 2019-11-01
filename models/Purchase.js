const mongoose = require('mongoose')
const { Schema } = mongoose

const purchaseSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  album: { type: Schema.Types.ObjectId, ref: 'album' }
})

module.exports = mongoose.model('purchase', purchaseSchema)
