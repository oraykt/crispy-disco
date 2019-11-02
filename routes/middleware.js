const authorization = require('../services/authorization')

module.exports = (req, res, next) => {
  const authCode = req.headers.authorization
  authorization
    .checkAuthCode(authCode)
    .then(() => {
      next()
    })
    .catch(err => {
      res
        .status(err.status ? err.status : 500)
        .json({ errorMessage: err.message })
    })
}
