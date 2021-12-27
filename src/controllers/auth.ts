import { NextFunction, Request, Response } from 'express'

import { AuthModel } from '../models/auth'
import { AppError, UnknownError } from '../utils/error'

const authModel = new AuthModel()

export class AuthController {
  async getAuthUrl(_req: Request, res: Response) {
    res.send(authModel.authUrl)
  }

  async authCallback(req: Request, res: Response) {
    const code = req.query.code as string
    authModel
      .authCallback(code)
      .then(({ sessionId, token }) => {
        res.json({
          code: 'Authorized',
          message: 'Authorized.',
          sessionId,
          token
        })
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

  async authenticate(req: Request, res: Response, next: NextFunction) {
    const { sessionid: sessionId, authorization: token } = req.headers
    authModel
      .authenticate(sessionId as string, token as string)
      .then(next)
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

  async authenticateInQuery(req: Request, res: Response, next: NextFunction) {
    const { sessionid: sessionId, authorization: token } = req.query
    authModel
      .authenticate(sessionId as string, token as string)
      .then(next)
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
}
