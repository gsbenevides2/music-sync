import { DatabaseManager } from '../../database/database'
import api from '../api'
import { Artist } from '../apiTypes'
import { networkTest, NotMoreError } from './utils'

function fetchArtistsFromApi(page: number) {
  return new Promise<Artist[]>((resolve, reject) => {
    api
      .get<Artist[]>('/artists', {
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

async function fetchArtistsFromDatabase(page: number): Promise<Artist[]> {
  const database = new DatabaseManager()
  await database.open()
  const artists: Artist[] = await database.getObjects('artists')
  return artists
}

async function saveInDb(artists: Artist[]) {
  const database = new DatabaseManager()
  await database.open()
  return database.addObjects(artists, 'artists')
}

export function fetchArtists(page: number) {
  return new Promise<Artist[]>((resolve, reject) => {
    networkTest()
      .then(goTo => {
        if (goTo === 'api') {
          fetchArtistsFromApi(page)
            .then(artists => {
              resolve(artists)
              saveInDb(artists)
            })
            .catch(reject)
        } else if (page !== 0) {
          reject(new NotMoreError())
        } else {
          fetchArtistsFromDatabase(page).then(resolve)
        }
      })

      .catch(reject)
  })
}
