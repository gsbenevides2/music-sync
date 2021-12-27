import { Request, Response } from 'express'

import { ArtistsModel } from '../models/artists'
import { NotFoundArtists } from '../models/artists/errors'

const artistsModel = new ArtistsModel()

export class ArtistsController {
  async search(req: Request, res: Response) {
    const name = req.query.name as string
    const pag = Number(req.query.pag as string | undefined) || 0

    const artists = await artistsModel.search(name, pag)

    if (artists.length) res.json(artists)
    else {
      const error = new NotFoundArtists()
      res.status(error.status).json(error.toJson())
    }
  }

  async list(req: Request, res: Response) {
    const pag = Number(req.query.pag as string | undefined) || 0

    const artists = await artistsModel.list(pag)

    if (artists.length) res.json(artists)
    else {
      const error = new NotFoundArtists()
      res.status(error.status).json(error.toJson())
    }
  }
}
