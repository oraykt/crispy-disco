const mongoose = require('mongoose')

module.exports = () => {
  mongoose.connect(require('../config/key').mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  mongoose.set('useCreateIndex', true)
  mongoose.set('useFindAndModify', false)

  mongoose.connection.on('open', () => {
    console.log('MongoDB: Connected!')
  })
  mongoose.connection.on('error', error => {
    console.log('MongoDB: Connection Failed! \n', error)
  })

  mongoose.Promise = global.Promise
  // eslint-disable-next-line semi
};
