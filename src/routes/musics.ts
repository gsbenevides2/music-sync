import { Router } from 'express'

import { authValidantion } from '../celebrate/auth'
import { musicsValidation } from '../celebrate/musics'
import { AuthController } from '../controllers/auth'
import { MusicsController } from '../controllers/musics'

const authController = new AuthController()
const musicsController = new MusicsController()

const musicsRoutes = Router()

musicsRoutes.get(
  '/musics',
  authValidantion.authenticate,
  authController.authenticate,
  musicsValidation.list,
  musicsController.list
)
musicsRoutes.get(
  '/musics/search',
  authValidantion.authenticate,
  authController.authenticate,
  musicsValidation.search,
  musicsController.search
)
musicsRoutes.get(
  '/musics/play',
  musicsValidation.play,
  authController.authenticateInQuery,
  musicsController.play
)
musicsRoutes.get(
  '/music/:id',
  authValidantion.authenticate,
  authController.authenticate,
  musicsValidation.get,
  musicsController.get
)
musicsRoutes.get(
  '/music/:id/download',
  authValidantion.authenticate,
  authController.authenticate,
  musicsController.download
)

musicsRoutes.post(
  '/music',
  authValidantion.authenticate,
  authController.authenticate,
  musicsValidation.create,
  musicsController.create
)
export { musicsRoutes }
