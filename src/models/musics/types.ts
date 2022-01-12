import { Album } from '../albums/types'
import { Artist } from '../artists/types'

export interface Music {
  id: string
  name: string
  artistId: string
  albumId: string
  youtubeId: string
  spotifyId: string
  trackNumber: string
  discNumber: string
  lyrics: string | null
  createdAt: Date
}

export interface MusicList {
  id: string
  name: string
  youtubeId: string
  spotifyId: string
  trackNumber: string
  discNumber: string
  lyrics: string | null
  createdAt: Date

  artistId?: string
  artist?: Artist
  albumId?: string
  album?: Album
}
