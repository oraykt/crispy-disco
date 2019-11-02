/* eslint-disable no-throw-literal */
let authorizationKeys = []

// When User logs in, the authorization will be removed after 10mins
const sessionTimer = authCode => {
  setTimeout(() => {
    authorizationKeys = authorizationKeys.filter(token => {
      return token !== authCode
    })
    console.log("Auth code's removed")
  }, 1000 * 60 * 5)
}

const checkAuthCode = authCode => {
  return authorizationKeys.includes(authCode)
}

module.exports = {
  checkAuthCode: async authCode => {
    if (checkAuthCode(authCode)) {
      return true
    } else {
      throw { message: 'Please Log in', status: 403 }
    }
  },
  generateAuthCode: async userName => {
    const hash =
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15)
    if (!checkAuthCode(hash)) {
      authorizationKeys.push(hash)
      sessionTimer(hash)
      return hash
    } else {
      throw { message: 'Already logged in', status: 400 }
    }
  },

  removeAuthCode: async authCode => {
    if (checkAuthCode(authCode)) {
      authorizationKeys = authorizationKeys.filter(val => {
        return val !== authCode
      })
    } else {
      throw { message: 'Session not found', status: 400 }
    }
  }
}
