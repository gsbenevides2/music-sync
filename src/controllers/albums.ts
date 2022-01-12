import { Request, Response } from 'express'

import { AlbumsModel } from '../models/albums'
import { AppError } from '../utils/errors/AppError'
import { NotFoundAlbums } from '../utils/errors/NotFoundAlbums'
import { UnknownError } from '../utils/errors/UnknownError'

const albumsModel = new AlbumsModel()

export class AlbumsController {
  async search(req: Request, res: Response) {
    const name = req.query.name as string
    const pag = Number(req.query.pag as string | undefined) || 0

    albumsModel
      .search(name, pag)
      .then(albumsSearched => {
        if (albumsSearched.length) res.json(albumsSearched)
        else {
          const error = new NotFoundAlbums()
          res.status(error.status).json(error.toJson())
        }
      })
      .catch(error => {
        console.error(error)
        if (error instanceof AppError) {
          res.status(error.status).json(error.toJson())
        } else {
          const unknownError = new UnknownError()
          res.status(unknownError.status).json(unknownError.toJson())
        }
      })
  }

  async list(req: Request, res: Response) {
    const pag = Number(req.query.pag as string | undefined) || 0
    albumsModel
      .list(Number(pag))
      .then(albums => {
        if (albums.length) res.json(albums)
        else {
          const error = new NotFoundAlbums()
          res.status(error.status).json(error.toJson())
        }
      })
      .catch(error => {
        console.error(error)
        if (error instanceof AppError) {
          res.status(error.status).json(error.toJson())
        } else {
          const unknownError = new UnknownError()
          res.status(unknownError.status).json(unknownError.toJson())
        }
      })
  }
}
