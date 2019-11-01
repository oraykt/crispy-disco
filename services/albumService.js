/* eslint-disable no-throw-literal */
const Album = require('../models/Album')

const albumService = {
  importAlbum: async ({ title, performer, cost }) => {
    return new Album({
      title,
      performer,
      cost
    }).save()
  },

  getAlbums: async () => {
    return Album.find()
  },

  getAlbum: async albumId => {
    return Album.findById(albumId).then(async album => {
      if (album) {
        return album
      } else {
        throw { message: 'Album not found!', status: 400 }
      }
    })
  },

  updateAlbum: async (albumId, content) => {
    const album = await Album.findById(albumId)
    if (album) {
      return Album.findByIdAndUpdate(
        albumId,
        {
          title: content.title ? content.title : album.title,
          performer: content.performer ? content.performer : album.performer,
          cost: content.cost ? content.cost : album.cost
        },
        { new: true }
      )
    } else {
      throw { message: 'Album not found!', status: 400 }
    }
  },

  deleteAlbum: async albumId => {
    await Album.findById(albumId).then(async album => {
      if (album) {
        await album.remove()
      } else {
        throw { message: 'Album not found!', status: 400 }
      }
    })
  }
}

module.exports = albumService
