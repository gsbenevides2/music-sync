import { Router } from 'express'

import { authValidantion } from '../celebrate/auth'
import { playlistsValidation } from '../celebrate/playlists'
import { AuthController } from '../controllers/auth'
import { PlaylistController } from '../controllers/playlists'

const playlistsRoutes = Router()
const authController = new AuthController()
const playlistController = new PlaylistController()

playlistsRoutes.get(
  '/playlists',
  authValidantion.authenticate,
  authController.authenticate,
  playlistController.list
)

playlistsRoutes.post(
  '/playlist',
  authValidantion.authenticate,
  authController.authenticate,
  playlistsValidation.create,
  playlistController.create
)
playlistsRoutes.get(
  '/playlist/:playlistId',
  authValidantion.authenticate,
  authController.authenticate,
  playlistsValidation.listMusics,
  playlistController.getMusics
)

playlistsRoutes.post(
  '/playlist/:playlistId/addMusic',
  authValidantion.authenticate,
  authController.authenticate,
  playlistsValidation.addMusic,
  playlistController.addMusic
)
playlistsRoutes.post(
  '/playlist/:playlistId/:musicId/rearrange',
  authValidantion.authenticate,
  authController.authenticate,
  playlistsValidation.rearrange,
  playlistController.rearrange
)
playlistsRoutes.delete(
  '/playlist/:playlistId/:musicId',
  authValidantion.authenticate,
  authController.authenticate,
  playlistsValidation.deleteMusic,
  playlistController.removeMusic
)

export { playlistsRoutes }
