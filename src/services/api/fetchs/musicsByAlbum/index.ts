import {
  Music,
  MusicWithAlbum,
  MusicWithArtist,
  MusicWithArtistAndAlbum
} from '../../apiTypes'
import { networkTest, NotMoreError } from '../utils'
import { fetchFromApi } from './fetchFromApi'
import { fetchFromDatabase } from './fetchFromDatabase'
import { saveInDb } from './saveInDb'

export function fetchMusicsByAlbum(
  page: number,
  albumId: string,
  withAlbum: false,
  withArtist: false
): Promise<Music[]>
export function fetchMusicsByAlbum(
  page: number,
  albumId: string,
  withAlbum: true,
  withArtist: false
): Promise<MusicWithAlbum[]>
export function fetchMusicsByAlbum(
  page: number,
  albumId: string,
  withAlbum: false,
  withArtist: true
): Promise<MusicWithArtist[]>
export function fetchMusicsByAlbum(
  page: number,
  albumId: string,
  withAlbum: true,
  withArtist: true
): Promise<MusicWithArtistAndAlbum[]>
export function fetchMusicsByAlbum(
  page: number,
  albumId: string,
  withAlbum: boolean,
  withArtist: boolean
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    networkTest()
      .then(goTo => {
        if (goTo === 'api') {
          fetchFromApi(page, albumId, withAlbum, withArtist)
            .then(musics => {
              resolve(musics)
              saveInDb(musics, withAlbum, withArtist)
            })
            .catch(reject)
        } else if (page !== 0) {
          reject(new NotMoreError())
        } else {
          fetchFromDatabase(albumId,withAlbum, withArtist).then(resolve)
        }
      })

      .catch(reject)
  })
}
