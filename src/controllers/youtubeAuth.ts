import { Request, Response } from 'express'

import { YoutubeService } from '../services/youtube'
import { AppError } from '../utils/errors/AppError'
import { UnknownError } from '../utils/errors/UnknownError'

const youtubeService = new YoutubeService()

export class YoutubeAuthController {
  async getUrl(req: Request, res: Response) {
    res.send(await youtubeService.getAuthUrl())
  }

  async callback(req: Request, res: Response) {
    const { code, state } = req.query as { code: string; state: string }
    youtubeService
      .getAndSaveTokenFromCodeAndSecurityID(code, state)
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
    const result = await youtubeService.isAuthenticated()
    res.send({ result })
  }
}
