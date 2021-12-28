import { DatabaseManager } from '../../database/database'
import api from '../api'
import { Album } from '../apiTypes'
import { networkTest, NotMoreError } from './utils'

function fetchAlbumsFromApi(page: number) {
  return new Promise<Album[]>((resolve, reject) => {
    api
      .get<Album[]>('/albums', {
        method: 'get',
        params: {
          pag: page
        }
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(reject)
  })
}

async function fetchAlbumsFromDatabase(page: number): Promise<Album[]> {
  const database = new DatabaseManager()
  await database.open()
  const albums: Album[] = await database.getObjects('albums')
  return albums
}

async function saveInDb(albums: Album[]) {
  const database = new DatabaseManager()
  await database.open()
  return database.addObjects(albums, 'albums')
}

export function fetchAlbums(page: number) {
  return new Promise<Album[]>((resolve, reject) => {
    networkTest()
      .then(goTo => {
        if (goTo === 'api') {
          fetchAlbumsFromApi(page)
            .then(albums => {
              resolve(albums)
              saveInDb(albums)
            })
            .catch(reject)
        } else if (page !== 0) {
          reject(new NotMoreError())
        } else {
          fetchAlbumsFromDatabase(page).then(resolve)
        }
      })

      .catch(reject)
  })
}
