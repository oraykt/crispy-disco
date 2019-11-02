/* eslint-disable no-throw-literal */

const User = require('../models/User')

const userService = {
  signUp: async ({ userName, userEmail }) => {
    const user = await User.findOne({ userName })
    if (user) throw { message: "User's already registered!", status: 400 }
    return new User({ userName, userEmail }).save()
  },
  logIn: async ({ userName, userEmail }) => {
    const user = await User.findOne({ userName })
    if (user) return user
    else throw { message: 'User not found!', status: 400 }
  },
  removeUser: async ({ userName, userEmail }) => {
    await User.findOne({ userName }).then(async user => {
      if (user) {
        await user.remove()
      } else {
        throw { message: 'User not found!', status: 400 }
      }
    })
  }
}

module.exports = userService
