const express = require('express')
const router = express.Router()

const userService = require('../services/userService')
const authorization = require('../services/authorization')

router.post('/signup', async (req, res) => {
  await userService
    .signUp(req.body)
    .then(async user => {
      await authorization.generateAuthCode(user.userName).then(async token => {
        await res.setHeader('authorization', token)
      })
      await res.status(200).json({ data: user })
    })
    .catch(err => {
      res.status(500).json({ errorMessage: err.message })
    })
})

router.post('/login', (req, res) => {
  userService
    .logIn(req.body)
    .then(user => {
      authorization.generateAuthCode(user.userName).then(token => {
        res.setHeader('authorization', token)
        res.status(200).json(user)
      })
    })
    .catch(err => {
      res
        .status(err.status ? err.status : 500)
        .json({ errorMessage: err.message })
    })
})

router.post('/logout', (req, res) => {
  const authCode = req.headers.authorization
  authorization
    .removeAuthCode(authCode)
    .then(() => {
      res.status(204).send()
    })
    .catch(err => {
      res
        .status(err.status ? err.status : 500)
        .json({ errorMessage: err.message })
    })
})

module.exports = router
