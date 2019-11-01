const express = require('express')
const router = express.Router()

router.post('/purchase', (req, res) => {
  res.send('Purchase')
})

module.exports = router
