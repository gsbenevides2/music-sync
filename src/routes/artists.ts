import { Router } from 'express'

import { artistsValidation } from '../celebrate/artists'
import { authValidantion } from '../celebrate/auth'
import { ArtistsController } from '../controllers/artists'
import { AuthController } from '../controllers/auth'

const artistsRoutes = Router()

const authController = new AuthController()
const artistsController = new ArtistsController()

artistsRoutes.get(
  '/artists/search',
  authValidantion.authenticate,
  authController.authenticate,
  artistsValidation.search,
  artistsController.search
)
artistsRoutes.get(
  '/artists',
  authValidantion.authenticate,
  authController.authenticate,
  artistsValidation.list,
  artistsController.list
)

export { artistsRoutes }
