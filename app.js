const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const user = require('./routes/userRouter')
const albumRouter = require('./routes/albumRouter')

const app = express()
// db connection
require('./helper/db.js')()
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/user', user)
app.use('/album', albumRouter)

// Middleware
const middleWare = require('./routes/middleware')
// Purchase
const purchaseService = require('./services/purchase')
app.get('/purchase', middleWare, (req, res) => {
  purchaseService
    .getPurchases()
    .then(purchases => {
      res.status(200).json({ data: purchases })
    })
    .catch(err => {
      res.status(500).json({ message: err.message })
    })
})

app.post('/purchase', middleWare, (req, res) => {
  const {
    user: { _id: userId },
    album: { _id: albumId }
  } = req.body
  purchaseService
    .postPurchase(userId, albumId)
    .then(purchase => {
      purchaseService
        .getPurchase(userId)
        .then(data => {
          res.status(200).json({ data })
        })
        .catch(err => {
          res.status(500).json({ message: err.essage })
        })
    })
    .catch(err => {
      res.status(500).json({ message: err.essage })
    })
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
