import { Request, Response } from 'express'

import { SpotifyAuthModel } from '../models/spotifyAuth'
import { AppError, UnknownError } from '../utils/error'

const spotifyAuthModel = new SpotifyAuthModel()

export class SpotifyAuthController {
  async getUrl(req: Request, res: Response) {
    res.send(await spotifyAuthModel.getAuthUrl())
  }

  async callback(req: Request, res: Response) {
    const { code, state } = req.query as { code: string; state: string }

    spotifyAuthModel
      .getNewToken(code, state)
      .then(() => {
        res.send('OK')
      })
      .catch(error => {
        if (error instanceof AppError) {
          res.status(error.status).json(error.toJson())
        } else {
          console.error(error)
          const unknownError = new UnknownError()
          res.status(unknownError.status).json(unknownError.toJson())
        }
      })
  }

  async isAuthenticated(_: Request, res: Response) {
    const result = await spotifyAuthModel.isAuthenticated()
    res.send({ result })
  }
}
