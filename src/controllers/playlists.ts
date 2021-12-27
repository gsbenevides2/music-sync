import { Request, Response } from 'express'

import { PlaylistsModel } from '../models/playlists'
import { AppError, UnknownError } from '../utils/error'

const playlistsModel = new PlaylistsModel()

export class PlaylistController {
  async create(req: Request, res: Response) {
    const name = req.body.name as string
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
}
