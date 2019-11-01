const express = require('express')
const router = express.Router()

/* GET home page. */
router.post('/signup', (req, res) => {
  res.send('User Signup')
})

router.post('/login', (req, res) => {
  res.render('User Login')
})

router.post('/logout', (req, res) => {
  res.render('User Logout')
})

module.exports = router
