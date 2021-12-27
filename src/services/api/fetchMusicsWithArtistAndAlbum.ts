import { DatabaseManager } from '../database/database'
import api from './api'
import { Album, Artist, Music, MusicWithArtistAndAlbum } from './apiTypes'

class OfflineError extends Error {
  code = 'Offline'
}

class NotMoreError extends Error {
  code = 'NotMoreError'
}

function networkTest() {
  return new Promise<'api' | 'db'>((resolve, reject) => {
    const offline = localStorage.getItem('offline')
    if (navigator.onLine === true) resolve('api')
    else if (offline === 'true') resolve('db')
    else reject(new OfflineError())
  })
}

function fetchMusicsFromApi(page: number) {
  return new Promise<MusicWithArtistAndAlbum[]>((resolve, reject) => {
    api
      .get<MusicWithArtistAndAlbum[]>('/musics', {
        method: 'get',
        params: {
          withAlbum: true,
          withArtist: true,
          pag: page
        }
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(reject)
  })
}

async function fetchMusicsFromDatabase(
  page: number
): Promise<MusicWithArtistAndAlbum[]> {
  const database = new DatabaseManager()
  await database.open()
  const musics: Music[] = await database.getObjects('musics')
  const artists: Artist[] = await database.getObjects('artists')
  const albums: Album[] = await database.getObjects('albums')
  return musics.map(music => {
    const artist = artists.find(a => music.artistId === a.id) as Artist
    const album = albums.find(a => music.albumId === a.id) as Album
    return {
      id: music.id,
      name: music.name,
      youtubeId: music.youtubeId,
      spotifyId: music.spotifyId,
      trackNumber: music.trackNumber,
      discNumber: music.discNumber,
      lyrics: music.lyrics,
      createdAt: music.createdAt,
      album,
      artist
    }
  })
}

async function saveInDb(musics: MusicWithArtistAndAlbum[]) {
  const database = new DatabaseManager()
  await database.open()
  const artists: Artist[] = []
  const albums: Album[] = []
  const musicsF: Music[] = musics.map(m => {
    const artist = m.artist
    const album = m.album
    if (artists.findIndex(a => artist.id === a.id) === -1) {
      artists.push(artist)
    }
    if (albums.findIndex(a => album.id === a.id) === -1) {
      albums.push(album)
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
      albumId: m.album.id,
      artistId: m.artist.id
    }
  })
  return Promise.all([
    database.addObjects(artists, 'artists'),
    database.addObjects(albums, 'albums'),
    database.addObjects(musicsF, 'musics')
  ])
}

export function fetchMusicsWithArtistAndAlbum(page: number) {
  return new Promise<MusicWithArtistAndAlbum[]>((resolve, reject) => {
    networkTest()
      .then(goTo => {
        if (goTo === 'api') {
          fetchMusicsFromApi(page)
            .then(musics => {
              resolve(musics)
              saveInDb(musics)
            })
            .catch(reject)
        } else if (page !== 0) {
          reject(new NotMoreError())
        } else {
          fetchMusicsFromDatabase(page).then(resolve)
        }
      })

      .catch(reject)
  })
}
