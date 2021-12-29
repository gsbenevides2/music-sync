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

export function fetchMusics(
  page: number,
  withAlbum: false,
  withArtist: false
): Promise<Music[]>
export function fetchMusics(
  page: number,
  withAlbum: true,
  withArtist: false
): Promise<MusicWithAlbum[]>
export function fetchMusics(
  page: number,
  withAlbum: false,
  withArtist: true
): Promise<MusicWithArtist[]>
export function fetchMusics(
  page: number,
  withAlbum: true,
  withArtist: true
): Promise<MusicWithArtistAndAlbum[]>
export function fetchMusics(
  page: number,
  withAlbum: boolean,
  withArtist: boolean
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    networkTest()
      .then(goTo => {
        if (goTo === 'api') {
          fetchFromApi(page, withAlbum, withArtist)
            .then(musics => {
              resolve(musics)
              saveInDb(musics, withAlbum, withArtist)
            })
            .catch(reject)
        } else if (page !== 0) {
          reject(new NotMoreError())
        } else {
          fetchFromDatabase(withAlbum, withArtist).then(resolve)
        }
      })

      .catch(reject)
  })
}
