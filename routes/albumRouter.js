const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('Get Albums')
})

router.get('/', (req, res) => {
  res.send('Get an Album')
})

router.get('/', (req, res) => {
  res.send('Post Album')
})

router.get('/', (req, res) => {
  res.send('Put Album')
})

router.get('/', (req, res) => {
  res.send('Delete Album')
})

module.exports = router
