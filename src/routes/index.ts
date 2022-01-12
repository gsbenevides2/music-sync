import { Router } from 'express'

import { albumsRoutes } from './albums'
import { artistsRoutes } from './artists'
import { authRoutes } from './auth'
import { musicsRoutes } from './musics'
import { playlistsRoutes } from './playlists'
import { spotifyAuthRoutes } from './spotifyAuth'
import { youtubeAuthRoutes } from './youtubeAuth'

const routes = Router()

routes.use(albumsRoutes)
routes.use(artistsRoutes)
routes.use(authRoutes)
routes.use(musicsRoutes)
routes.use(playlistsRoutes)
routes.use(spotifyAuthRoutes)
routes.use(youtubeAuthRoutes)

export { routes }
