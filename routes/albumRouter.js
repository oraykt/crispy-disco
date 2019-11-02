const express = require('express')
const router = express.Router()

const albumService = require('../services/albumService')

const middleWare = require('./middleware')

router.get('/', (req, res) => {
  albumService
    .getAlbums()
    .then(albums => {
      res.status(200).json({ data: albums })
    })
    .catch(err => {
      res.status(500).json({ errorMessage: err.message })
    })
})

router.get('/:id', (req, res) => {
  albumService
    .getAlbum(req.params.id)
    .then(album => {
      res.status(200).json({ data: album })
    })
    .catch(err => {
      res
        .status(err.status ? err.status : 500)
        .json({ errorMessage: err.message })
    })
})

router.post('/', middleWare, (req, res) => {
  albumService
    .importAlbum(req.body)
    .then(album => {
      res.status(200).json({ data: album })
    })
    .catch(err => {
      res
        .status(err.status ? err.status : 500)
        .json({ errorMessage: err.message })
    })
})

router.put('/:id', middleWare, (req, res) => {
  albumService
    .updateAlbum(req.params.id, req.body)
    .then(updatedAlbum => {
      res.status(200).json({ data: updatedAlbum })
    })
    .catch(err => {
      res
        .status(err.status ? err.status : 500)
        .json({ errorMessage: err.message })
    })
})

router.delete('/:id', middleWare, (req, res) => {
  const albumId = req.params.id
  albumService
    .deleteAlbum(albumId)
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
