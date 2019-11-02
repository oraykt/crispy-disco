const Purchase = require('../models/Purchase')
module.exports = {
  getPurchase: async userId => {
    return Purchase.findOne({ user: userId })
      .populate('user')
      .populate('album')
  },
  getPurchases: async () => {
    return Purchase.find()
      .populate('user')
      .populate('album')
  },
  postPurchase: async (userId, albumId) => {
    return new Purchase({ user: userId, album: albumId }).save()
  }
}
