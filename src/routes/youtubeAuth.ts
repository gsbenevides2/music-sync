import { Router } from 'express'

import { authValidantion } from '../celebrate/auth'
import { youtubeAuthValidantions } from '../celebrate/youtubeAuth'
import { AuthController } from '../controllers/auth'
import { YoutubeAuthController } from '../controllers/youtubeAuth'

const youtubeAuthRoutes = Router()
const youtubeAuthController = new YoutubeAuthController()
const authController = new AuthController()

youtubeAuthRoutes.get(
  '/youtubeAuth',
  authValidantion.authenticate,
  authController.authenticate,
  youtubeAuthController.getUrl
)

youtubeAuthRoutes.get(
  '/youtubeAuth/callback',
  youtubeAuthValidantions.callback,
  youtubeAuthController.callback
)
export { youtubeAuthRoutes }
