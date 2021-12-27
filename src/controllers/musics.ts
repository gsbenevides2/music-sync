import { Request, Response } from 'express'
import path from 'path'
import { playMiddleware } from '../middleware/play'

import { MusicsModel } from '../models/musics'
import { NotFoundMusic, NotFoundMusics } from '../models/musics/errors'
import { AppError, UnknownError } from '../utils/error'

const musicsModel = new MusicsModel()

export class MusicsController {
  async create(req: Request, res: Response) {
    const spotifylink = req.body.spotifyLink as string
    const useYoutubeId = req.body.useYoutubeId as string | undefined
    musicsModel
      .create(spotifylink, useYoutubeId)
      .then(id => {
        res.status(201).send({
          code: 'MusicCreated',
          message: 'Music created.',
          id
        })
      })
      .catch(error => {
        console.log(error)
        if (error instanceof AppError) {
          res.status(error.status).json(error.toJson())
        } else {
          const unknownError = new UnknownError()
          res.status(unknownError.status).json(unknownError.toJson())
        }
      })
  }

  async list(req: Request, res: Response) {
    const pag = (req.query.pag as number | undefined) || 0
    const withAlbum = (req.query.withAlbum as boolean | undefined) || false
    const withArtist = (req.query.withArtist as boolean | undefined) || false

    musicsModel
      .list(withAlbum, withArtist, pag)
      .then(musics => {
        if (musics.length) res.json(musics)
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

  async search(req: Request, res: Response) {
    const pag = (req.query.pag as number | undefined) || 0
    const withAlbum = (req.query.withAlbum as boolean | undefined) || false
    const withArtist = (req.query.withArtist as boolean | undefined) || false
    const name = req.query.name as string

    musicsModel
      .search(withAlbum, withArtist, pag, name)
      .then(musics => {
        if (musics.length) res.json(musics)
        else {
          const error = new NotFoundMusics()
          res.status(error.status).json(error.toJson())
        }
      })
      .catch(error => {
        console.log(error)
        if (error instanceof AppError) {
          res.status(error.status).json(error.toJson())
        } else {
          const unknownError = new UnknownError()
          res.status(unknownError.status).json(unknownError.toJson())
        }
      })
  }

  async get(req: Request, res: Response) {
    const withAlbum = (req.query.withAlbum as boolean | undefined) || false
    const withArtist = (req.query.withArtist as boolean | undefined) || false

    const id = req.params.id as string

    musicsModel
      .get(withAlbum, withArtist, id)
      .then(music => {
        if (music) res.json(music)
        else {
          const error = new NotFoundMusic()
          res.status(error.status).json(error.toJson())
        }
      })
      .catch(error => {
        console.log(error)
        if (error instanceof AppError) {
          res.status(error.status).json(error.toJson())
        } else {
          const unknownError = new UnknownError()
          res.status(unknownError.status).json(unknownError.toJson())
        }
      })
  }

  download(req: Request, res: Response) {
    const musicId = req.params.id
    res.download(path.resolve(process.cwd(), 'temp', `${musicId}.mp3`))
  }
  play(req: Request, res: Response) {
    playMiddleware(req, res)
  }
}
