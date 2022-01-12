export interface Album {
  id: string
  name: string
  spotifyId: string
  spotifyCoverUrl: string
  spotifyYear: string
  createdAt: Date
}

export interface Artist {
  id: string
  name: string
  spotifyId: string
  spotifyCoverUrl: string
  spotifyGenre: string
  createdAt: Date
}
export interface Music {
  id: string
  name: string
  youtubeId: string
  spotifyId: string
  trackNumber: string
  discNumber: string
  lyrics?: any
  createdAt: Date
  albumId: string
  artistId: string
}

export interface Playlist {
  id: string
  name: string
  youtubeId: string
  spotifyId: string
  createdAt: Date
}

export interface PlaylistItem {
  playlistId: string
  musics: string[]
}

export interface MusicWithArtist extends Omit<Music, 'artistId'> {
  artist: Artist
}

export interface MusicWithAlbum extends Omit<Music, 'albumId'> {
  album: Album
}

export interface MusicWithArtistAndAlbum
  extends Omit<MusicWithArtist, 'albumId'> {
  album: Album
}

export interface MusicCreated {
  code: 'MusicCreated'
  id: string
  message: 'Music created.'
}
