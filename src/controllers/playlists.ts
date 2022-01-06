import { Request, Response } from 'express'

import { MusicsModel } from '../models/musics'
import { NotFoundMusics } from '../models/musics/errors'
import { PlaylistsModel } from '../models/playlists'
import { NotFoundPlaylists } from '../models/playlists/errors'
import { AppError, UnknownError } from '../utils/error'

export class PlaylistController {
  async create(req: Request, res: Response) {
    const name = req.body.name as string
    const playlistsModel = new PlaylistsModel({})
    const id = await playlistsModel.create(name)

    res.status(201).json({
      code: 'PlaylistCreated',
      message: 'Playlist created.',
      id
    })
  }

  async addMusic(req: Request, res: Response) {
    const musicId = req.body.musicId as string
    const playlistId = req.params.playlistId as string
    const playlistsModel = new PlaylistsModel({
      musicsModel: new MusicsModel({})
    })
    playlistsModel
      .addMusic(playlistId, musicId)
      .then(() => {
        res.status(201).json({
          code: 'MusicAdded',
          message: 'Success'
        })
      })
      .catch(error => {
        if (error instanceof AppError) {
          res.status(error.status).json(error.toJson())
        } else {
          const unknownError = new UnknownError()
          res.status(unknownError.status).json(unknownError.toJson())
        }
      })
  }

  async rearrange(req: Request, res: Response) {
    const newPosition = req.body.newPosition as number
    const playlistId = req.params.playlistId as string
    const musicId = req.params.musicId as string
    const playlistsModel = new PlaylistsModel({})
    playlistsModel
      .rearrange(newPosition, playlistId, musicId)
      .then(() => {
        res.status(200).json({
          code: 'Rearranged',
          message: 'Music rearranged!'
        })
      })
      .catch(error => {
        if (error instanceof AppError) {
          res.status(error.status).json(error.toJson())
        } else {
          const unknownError = new UnknownError()
          res.status(unknownError.status).json(unknownError.toJson())
        }
      })
  }

  async removeMusic(req: Request, res: Response) {
    const { playlistId, musicId } = req.params
    const playlistsModel = new PlaylistsModel({})
    playlistsModel
      .removeMusic(playlistId, musicId)
      .then(() => {
        res.status(200).json({
          code: 'MusicRemoved',
          message: 'Music Removed'
        })
      })
      .catch(error => {
        if (error instanceof AppError) {
          res.status(error.status).json(error.toJson())
        } else {
          const unknownError = new UnknownError()
          res.status(unknownError.status).json(unknownError.toJson())
        }
      })
  }

  async getMusics(req: Request, res: Response) {
    const pag = (req.query.pag as number | undefined) || 0
    const withAlbum = (req.query.withAlbum as boolean | undefined) || false
    const withArtist = (req.query.withArtist as boolean | undefined) || false
    const { playlistId } = req.params

    const playlistModel = new PlaylistsModel({})

    playlistModel
      .getMusics(playlistId, withAlbum, withArtist, pag)
      .then(musics => {
        if (musics.length) res.json(musics)
        else {
          const error = new NotFoundPlaylists()
          res.status(error.status).json(error.toJson())
        }
      })
      .catch(error => {
        if (error instanceof AppError) {
          res.status(error.status).json(error.toJson())
        } else {
          console.log(error)
          const unknownError = new UnknownError()
          res.status(unknownError.status).json(unknownError.toJson())
        }
      })
  }

  async list(req: Request, res: Response) {
    const playlistModel = new PlaylistsModel({})

    playlistModel
      .list()
      .then(playlists => {
        if (playlists.length) res.json(playlists)
        else {
          const error = new NotFoundMusics()
          res.status(error.status).json(error.toJson())
        }
      })
      .catch(error => {
        if (error instanceof AppError) {
          res.status(error.status).json(error.toJson())
        } else {
          console.log(error)
          const unknownError = new UnknownError()
          res.status(unknownError.status).json(unknownError.toJson())
        }
      })
  }
}
