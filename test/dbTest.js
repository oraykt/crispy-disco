/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const chai = require('chai')
const should = chai.should()
const mongoose = require('mongoose')

// Config

const key = require('../config/key')

// Models
const Album = require('../models/Album')
const User = require('../models/User')
const Purchase = require('../models/Purchase')
// db connection
require('../helper/db')()

let testUserId
let testAlbumId
let testPurchaseId

describe('Testing Models', () => {
  before(done => {
    mongoose.connection.on('open', () => {
      done()
    })
  })

  it('User Model', done => {
    new User({ name: key.userName, email: key.userEmail })
      .save()
      .then(newUser => {
        newUser.name.should.be.eql(key.userName)
        newUser.email.should.be.eql(key.userEmail)
        testUserId = newUser._id
        done()
      })
      .catch(err => {
        throw err
      })
  })

  it('Album Model', done => {
    new Album({
      title: key.albumTitle,
      performer: key.albumPerformer,
      cost: key.albumCost
    })
      .save()
      .then(newAlbum => {
        newAlbum.title.should.be.eql(key.albumTitle)
        newAlbum.performer.should.be.eql(key.albumPerformer)
        newAlbum.cost.should.be.eql(key.albumCost)
        testAlbumId = newAlbum._id
        done()
      })
      .catch(err => {
        throw err
      })
  })

  it('Purchase Model', done => {
    new Purchase({ user: testUserId, album: testAlbumId })
      .save()
      .then(newPurchase => {
        newPurchase.user.should.be.eql(testUserId)
        newPurchase.album.should.be.eql(testAlbumId)
        testPurchaseId = newPurchase._id
        Purchase.findById(testPurchaseId)
          .populate('user')
          .populate('album')
          .then(purchase => {
            purchase.user._id.should.be.eql(testUserId)
            purchase.album._id.should.be.eql(testAlbumId)
            done()
          })
          .catch(err => {
            throw err
          })
      })
      .catch(err => {
        throw err
      })
  })

  it('Clear test data', done => {
    Purchase.findByIdAndDelete(testPurchaseId).then(() => {
      User.findByIdAndDelete(testUserId).then(() => {
        Album.findByIdAndDelete(testAlbumId).then(() => {
          done()
        })
      })
    })
  })
})
