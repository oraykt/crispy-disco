/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const server = require('../../app')
const mongoose = require('mongoose')

const key = require('../../config/key')

const User = require('../../models/User')

let userId
let albumId
let authorizationCode

chai.use(chaiHttp)

describe('Production Test', () => {
  before(done => {
    console.log('Wait MongoDB Connection')
    mongoose.connection.on('open', () => {
      done()
    })
  })

  it('POST /user/signup', done => {
    chai
      .request(server)
      .post('/user/signup')
      .set('content-type', 'application/json')
      .send({
        userName: key.userName,
        userEmail: key.userEmail
      })
      .end((_err, res) => {
        res.should.have.status(200)
        // res.headers.COULD.have.property('authorization')
        res.body.should.have.property('data')
        res.body.data.should.have.property('_id')
        userId = res.body.data._id
        res.body.data.should.have.property('userName')
        res.body.data.userName.should.be.eql(key.userName)
        res.body.data.should.have.property('userEmail')
        res.body.data.userEmail.should.be.eql(key.userEmail)
        done()
      })
  })

  it('POST /user/login', done => {
    chai
      .request(server)
      .post('/user/login')
      .set('content-type', 'application/json')
      .send({
        userName: key.userName,
        userEmail: key.userEmail
      })
      .end((_err, res) => {
        res.should.have.status(200)
        res.header.should.have.property('authorization')
        authorizationCode = res.header.authorization
        done()
      })
  })

  it('GET /album', done => {
    chai
      .request(server)
      .get('/album')
      .end((_err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('data')
        res.body.data.should.be.an('array')
        done()
      })
  })

  it('POST /album/', done => {
    chai
      .request(server)
      .post('/album')
      .set({
        'content-type': 'application/json',
        authorization: authorizationCode
      })
      .send({
        title: key.albumTitle,
        performer: key.albumPerformer,
        cost: parseInt(key.albumCost)
      })
      .end((_err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('data')
        res.body.data.should.have.property('_id')
        albumId = res.body.data._id
        res.body.data.should.have.property('title')
        res.body.data.title.should.be.eql(key.albumTitle)
        res.body.data.should.have.property('performer')
        res.body.data.performer.should.be.eql(key.albumPerformer)
        res.body.data.should.have.property('cost')
        res.body.data.cost.should.be.eql(parseInt(key.albumCost))
        done()
      })
  })

  it('GET /album/:id', done => {
    chai
      .request(server)
      .get('/album/' + albumId)
      .end((_err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('data')
        res.body.data.should.be.an('Object')
        res.body.data.should.have.property('title')
        res.body.data.title.should.be.eql(key.albumTitle)
        res.body.data.should.have.property('performer')
        res.body.data.performer.should.be.eql(key.albumPerformer)
        res.body.data.should.have.property('cost')
        res.body.data.cost.should.be.eql(parseInt(key.albumCost))
        done()
      })
  })

  it('PUT /album/:id', done => {
    chai
      .request(server)
      .put('/album/' + albumId)
      .set({
        'content-type': 'application/json',
        authorization: authorizationCode
      })
      .send({
        title: 'new' + key.albumTitle
      })
      .end((_err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('data')
        res.body.data._id.should.be.eql(albumId)
        res.body.data.should.have.property('title')
        res.body.data.title.should.be.eql('new' + key.albumTitle)
        res.body.data.should.have.property('performer')
        res.body.data.performer.should.be.eql(key.albumPerformer)
        res.body.data.should.have.property('cost')
        res.body.data.cost.should.be.eql(parseInt(key.albumCost))
        done()
      })
  })

  it('POST /purchase', done => {
    chai
      .request(server)
      .post('/purchase')
      .set({
        'content-type': 'application/json',
        authorization: authorizationCode
      })
      .send({
        user: {
          _id: userId
        },
        album: {
          _id: albumId
        }
      })
      .end((_err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('data')
        res.body.data.should.have.property('user')
        res.body.data.user._id.should.be.eql(userId)
        res.body.data.should.have.property('album')
        done()
      })
  })

  it('DELETE /album/:id', done => {
    chai
      .request(server)
      .delete('/album/' + albumId)
      .set({
        'content-type': 'application/json',
        authorization: authorizationCode
      })
      .end((_err, res) => {
        res.should.have.status(204)
        done()
      })
  })

  it('POST /user/logout', done => {
    chai
      .request(server)
      .post('/user/logout')
      .set('authorization', authorizationCode)
      .send({
        userName: key.userName,
        userEmail: key.userEmail
      })
      .end((_err, res) => {
        res.should.have.status(204)
        res.header.should.not.have.property('authorization')
        done()
      })
  })

  it('POST /album without Authorization ', done => {
    chai
      .request(server)
      .post('/album')
      .set('content-type', 'application/json')
      .send({
        title: key.albumTitle,
        performer: key.albumPerformer,
        cost: parseInt(key.albumCost)
      })
      .end((_err, res) => {
        res.should.have.status(403)
        done()
      })
  })

  it('Remove signed up user', done => {
    User.findOneAndDelete().then(() => {
      done()
    })
  })
})
