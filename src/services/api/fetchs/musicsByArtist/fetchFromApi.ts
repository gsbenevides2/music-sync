import api from '../../api'
import {
  Music,
  MusicWithAlbum,
  MusicWithArtist,
  MusicWithArtistAndAlbum
} from '../../apiTypes'

export function fetchFromApi(
  page: number,
  artistId:string,
  withAlbum: false,
  withArtist: false
): Promise<Music[]>
export function fetchFromApi(
  page: number,
  artistId:string,
  withAlbum: true,
  withArtist: false
): Promise<MusicWithAlbum[]>
export function fetchFromApi(
  page: number,
  artistId:string,
  withAlbum: false,
  withArtist: true
): Promise<MusicWithArtist[]>
export function fetchFromApi(
  page: number,
  artistId:string,
  withAlbum: true,
  withArtist: true
): Promise<MusicWithArtistAndAlbum[]>
export function fetchFromApi(
  page: number,
  artistId:string,
  withAlbum: boolean,
  withArtist: boolean
): Promise<any[]>
export function fetchFromApi(
  page: number,
  artistId:string,
  withAlbum: boolean,
  withArtist: boolean
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    api
      .get<
        | Music[]
        | MusicWithAlbum[]
        | MusicWithArtist[]
        | MusicWithArtistAndAlbum[]
      >(`/artist/${artistId}/musics`, {
        method: 'get',
        params: {
          withAlbum,
          withArtist,
          pag: page
        }
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(reject)
  })
}
