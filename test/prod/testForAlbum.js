/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const server = require('../../app')
const mongoose = require('mongoose')

const key = require('../../config/key')

let testAlbumId

chai.use(chaiHttp)

describe('Album Router', () => {
  before(done => {
    console.log('Wait MongoDB Connection')
    mongoose.connection.on('open', () => {
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
      .set('content-type', 'application/json')
      .send({
        title: key.albumTitle,
        performer: key.albumPerformer,
        cost: key.albumCost
      })
      .end((_err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('data')
        res.body.data.should.have.property('_id')
        testAlbumId = res.body.data._id
        res.body.data.should.have.property('title')
        res.body.data.title.should.be.eql(key.albumTitle)
        res.body.data.should.have.property('performer')
        res.body.data.performer.should.be.eql(key.albumPerformer)
        res.body.data.should.have.property('cost')
        res.body.data.cost.should.be.eql(key.albumCost)
        done()
      })
  })

  it('GET /album/:id', done => {
    chai
      .request(server)
      .get('/album/' + testAlbumId)
      .end((_err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('data')
        res.body.data.should.be.an('Object')
        res.body.data.should.have.property('title')
        res.body.data.title.should.be.eql(key.albumTitle)
        res.body.data.should.have.property('performer')
        res.body.data.performer.should.be.eql(key.albumPerformer)
        res.body.data.should.have.property('cost')
        res.body.data.cost.should.be.eql(key.albumCost)
        done()
      })
  })

  it('PUT /album/:id', done => {
    chai
      .request(server)
      .put('/album/' + testAlbumId)
      .set('content-type', 'application/json')
      .send({
        title: 'new' + key.albumTitle
      })
      .end((_err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('data')
        res.body.data._id.should.be.eql(testAlbumId)
        res.body.data.should.have.property('title')
        res.body.data.title.should.be.eql('new' + key.albumTitle)
        res.body.data.should.have.property('performer')
        res.body.data.performer.should.be.eql(key.albumPerformer)
        res.body.data.should.have.property('cost')
        res.body.data.cost.should.be.eql(key.albumCost)
        done()
      })
  })

  it('DELETE /album/:id', done => {
    chai
      .request(server)
      .delete('/album/' + testAlbumId)
      .end((_err, res) => {
        res.should.have.status(204)
        done()
      })
  })
})
