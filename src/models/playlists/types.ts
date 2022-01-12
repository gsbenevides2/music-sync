export interface Playlist {
  id: string
  name: string
  youtubeId?: string
  spotifyId?: string
  createdAt: Date
}

export interface PlaylistItem {
  position: number
  playlistId: string
  musicId: string
  youtubePlaylistItemId?: string
  ytSync: boolean
  spotifySync: boolean
}
