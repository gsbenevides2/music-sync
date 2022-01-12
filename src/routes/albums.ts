import { Router } from 'express'

import { albumsValidation } from '../celebrate/albums'
import { authValidantion } from '../celebrate/auth'
import { AlbumsController } from '../controllers/albums'
import { AuthController } from '../controllers/auth'

const authController = new AuthController()
const albumsController = new AlbumsController()

const albumsRoutes = Router()

albumsRoutes.get(
  '/albums/search',
  authValidantion.authenticate,
  authController.authenticate,
  albumsValidation.search,
  albumsController.search
)
albumsRoutes.get(
  '/albums',
  authValidantion.authenticate,
  authController.authenticate,
  albumsValidation.list,
  albumsController.list
)

export { albumsRoutes }
