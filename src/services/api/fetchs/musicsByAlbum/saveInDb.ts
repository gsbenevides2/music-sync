import { DatabaseManager } from '../../../database/database'
import {
  MusicWithArtistAndAlbum,
  Artist,
  Album,
  Music,
  MusicWithAlbum,
  MusicWithArtist
} from '../../apiTypes'

export async function saveInDb(
  musics: Music[],
  withAlbum: false,
  withArtist: false
): Promise<void>
export async function saveInDb(
  musics: MusicWithAlbum[],
  withAlbum: true,
  withArtist: false
): Promise<void>
export async function saveInDb(
  musics: MusicWithArtist[],
  withAlbum: false,
  withArtist: true
): Promise<void>
export async function saveInDb(
  musics: MusicWithArtistAndAlbum[],
  withAlbum: true,
  withArtist: true
): Promise<void>
export async function saveInDb(
  musics: any[],
  withAlbum: boolean,
  withArtist: boolean
): Promise<void>
export async function saveInDb(
  musics: any[],
  withAlbum: boolean,
  withArtist: boolean
): Promise<void> {
  const database = new DatabaseManager()
  await database.open()

  const artists: Artist[] = []
  const albums: Album[] = []
  const musicsF: Music[] = musics.map(m => {
    let albumId = m.albumId
    if (withAlbum) {
      const album = m.album
      if (albums.findIndex(a => album.id === a.id) === -1) {
        albums.push(album)
      }
      albumId = album.id
    }
    let artistId = m.artistId
    if (withArtist) {
      const artist = m.artist
      if (artists.findIndex(a => artist.id === a.id) === -1) {
        artists.push(artist)
      }
      artistId = artist.id
    }
    return {
      id: m.id,
      name: m.name,
      spotifyId: m.spotifyId,
      youtubeId: m.youtubeId,
      lyrics: m.lyrics,
      createdAt: m.createdAt,
      trackNumber: m.trackNumber,
      discNumber: m.discNumber,
      albumId,
      artistId
    }
  })

  await Promise.all([
    database.addObjects(artists, 'artists'),
    database.addObjects(albums, 'albums'),
    database.addObjects(musicsF, 'musics')
  ])
}
