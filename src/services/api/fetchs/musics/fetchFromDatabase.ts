import { DatabaseManager } from '../../../database/database'
import {
  Music,
  Artist,
  Album,
  MusicWithAlbum,
  MusicWithArtistAndAlbum,
  MusicWithArtist
} from '../../apiTypes'

export async function fetchFromDatabase(
  withAlbum: false,
  withArtist: false
): Promise<Music[]>
export async function fetchFromDatabase(
  withAlbum: true,
  withArtist: false
): Promise<MusicWithAlbum[]>
export async function fetchFromDatabase(
  withAlbum: false,
  withArtist: true
): Promise<MusicWithArtist[]>
export async function fetchFromDatabase(
  withAlbum: true,
  withArtist: true
): Promise<MusicWithArtistAndAlbum[]>
export async function fetchFromDatabase(
  withAlbum: boolean,
  withArtist: boolean
): Promise<any[]>
export async function fetchFromDatabase(
  withAlbum: boolean,
  withArtist: boolean
): Promise<any[]> {
  const database = new DatabaseManager()
  await database.open()
  const musics: Music[] = await database.getObjects('musics')
  const artists: Artist[] = await database.getObjects('artists')
  const albums: Album[] = await database.getObjects('albums')
  return musics.map(music => {
    const retuned: any = {
      id: music.id,
      name: music.name,
      youtubeId: music.youtubeId,
      spotifyId: music.spotifyId,
      trackNumber: music.trackNumber,
      discNumber: music.discNumber,
      lyrics: music.lyrics,
      createdAt: music.createdAt
    }
    if (withAlbum) retuned.album = albums.find(a => music.albumId === a.id)
    else retuned.albumId = music.albumId

    if (withArtist) retuned.artist = artists.find(a => music.artistId === a.id)
    else retuned.artistId = music.artistId

    return retuned
  })
}
