import { Router } from 'express'

import { authValidantion } from '../celebrate/auth'
import { AuthController } from '../controllers/auth'

const authRoutes = Router()
const authController = new AuthController()

authRoutes.get('/auth', authController.getAuthUrl)
authRoutes.get(
  '/authCallback',
  authValidantion.authCallback,
  authController.authCallback
)

authRoutes.get(
  '/revokeCredentials',
  authValidantion.authenticate,
  authController.authenticate,
  authController.revokeCredentials
)

export { authRoutes }
