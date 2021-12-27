import { Router } from 'express'

import { authValidantion } from '../celebrate/auth'
import { spotifyAuthValidantions } from '../celebrate/spotifyAuth'
import { AuthController } from '../controllers/auth'
import { SpotifyAuthController } from '../controllers/spotifyAuth'

const spotifyAuthRoutes = Router()
const spotifyAuthController = new SpotifyAuthController()
const authController = new AuthController()

spotifyAuthRoutes.get(
  '/spotifyAuth',
  authValidantion.authenticate,
  authController.authenticate,
  spotifyAuthController.getUrl
)

spotifyAuthRoutes.get(
  '/spotifyAuth/callback',
  spotifyAuthValidantions.callback,
  spotifyAuthController.callback
)
export { spotifyAuthRoutes }
