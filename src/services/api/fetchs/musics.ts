import { DatabaseManager } from '../../database/database'
import api from '../api'
import {
  Music,
  MusicWithAlbum,
  MusicWithArtistAndAlbum,
  MusicWithArtist,
  Artist,
  Album
} from '../apiTypes'
import {
  EventListenerOrEventListenerObject,
  AddEventListenerOptions,
  EspecialEventListenerOrEventListenerObject
} from './types'
import { getNetworkState, NetworkState } from './utils'

interface OptionsMusic {
  withArtist: boolean
  withAlbum: boolean
}

interface OptionsMusics extends OptionsMusic {
  findByAlbumId?: string
  findByArtistId?: string
}

type ResultNotArray =
  | Music
  | MusicWithAlbum
  | MusicWithArtist
  | MusicWithArtistAndAlbum

export class FetchMusics<Type extends ResultNotArray> extends EventTarget {
  options: OptionsMusics
  networkState: NetworkState
  constructor(options: OptionsMusics) {
    super()
    this.networkState = getNetworkState()
    this.options = options
  }

  async start() {
    const networkState = this.networkState

    if (networkState === 'api only') this.goToApiOnly()
    else if (networkState === 'db first') this.goToDbFirst()
    else if (networkState === 'db only') this.goToDbOnly()
  }

  private async goToApiOnly() {
    let page = 0
    while (true) {
      try {
        const result = await this.fetchFromApi(page)
        const dataEvent = new CustomEvent<Type[]>('data', {
          detail: result
        })
        this.dispatchEvent(dataEvent)
        await this.saveInDb(result)
        page++
      } catch (error: any) {
        const code: string =
          error.code || error.response?.data?.code || 'Unknoow Error'
        if (code === 'NotFoundMusics' && page > 0) break
        else if (this.networkState === 'db first' || page > 0) {
          const dataEvent = new CustomEvent<string>('error', {
            detail: 'NotLoadAllMusics'
          })
          this.dispatchEvent(dataEvent)
          break
        } else {
          const dataEvent = new CustomEvent<string>('error', { detail: code })
          this.dispatchEvent(dataEvent)
          break
        }
      }
    }
  }

  private async goToDbFirst() {
    await this.goToDbOnly()
    this.goToApiOnly()
  }

  private async goToDbOnly() {
    const result = await this.fetchFromDb()
    const dataEvent = new CustomEvent<Type[]>('data', {
      detail: result
    })
    this.dispatchEvent(dataEvent)
  }

  private fetchFromApi(page: number) {
    return new Promise<Type[]>((resolve, reject) => {
      const { withAlbum, withArtist, findByAlbumId, findByArtistId } =
        this.options

      let url
      if (findByAlbumId) url = `/album/${findByAlbumId}/musics`
      else if (findByArtistId) url = `/artist/${findByArtistId}/musics`
      else url = `/musics`

      api
        .get<Type[]>(url, {
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

  private async fetchFromDb(): Promise<Type[]> {
    const { withAlbum, withArtist, findByArtistId, findByAlbumId } =
      this.options

    const database = new DatabaseManager()
    await database.open()

    let musics: Music[]
    if (findByArtistId) {
      musics = await database.getObjectsUsingFilter(
        'musics',
        'artistId',
        findByArtistId
      )
    } else if (findByAlbumId) {
      musics = await database.getObjectsUsingFilter(
        'musics',
        'albumId',
        findByAlbumId
      )
    } else {
      musics = await database.getObjects('musics')
    }

    const artists: Artist[] = withArtist
      ? await database.getObjects('artists')
      : []
    const albums: Album[] = withAlbum ? await database.getObjects('albums') : []
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

      if (withArtist)
        retuned.artist = artists.find(a => music.artistId === a.id)
      else retuned.artistId = music.artistId

      return retuned as Type
    })
  }

  private async saveInDb(result: Type[]) {
    const database = new DatabaseManager()
    await database.open()

    const artists: Artist[] = []
    const albums: Album[] = []

    const musicsF: Music[] = result.map(m => {
      let albumId: string
      let artistId: string

      if ('album' in m) {
        albumId = m.album.id
        const findedAlbum = albums.findIndex(album => album.id === albumId)
        if (findedAlbum === -1) albums.push(m.album)
      } else {
        albumId = m.albumId
      }

      if ('artist' in m) {
        artistId = m.artist.id
        const findedArtist = artists.findIndex(artist => artist.id === artistId)
        if (findedArtist === -1) artists.push(m.artist)
      } else {
        artistId = m.artistId
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

  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions
  ): void

  addEventListener(
    type: 'data',
    callback: EspecialEventListenerOrEventListenerObject<Type[]> | null,
    options?: boolean | AddEventListenerOptions
  ): void

  addEventListener(
    type: 'error',
    callback: EspecialEventListenerOrEventListenerObject<string> | null,
    options?: boolean | AddEventListenerOptions
  ): void

  addEventListener(type: any, callback: any, options?: any): void {
    super.addEventListener(type, callback, options)
  }
}

export class FetchMusic<Type extends ResultNotArray> extends EventTarget {
  options: OptionsMusic
  networkState: NetworkState
  musicId: string
  constructor(options: OptionsMusic, musicId: string) {
    super()
    this.networkState = getNetworkState()
    this.options = options
    this.musicId = musicId
  }

  async start() {
    const networkState = this.networkState

    if (networkState === 'api only') this.goToApiOnly()
    else if (networkState === 'db first') this.goToDbFirst()
    else if (networkState === 'db only') this.goToDbOnly()
  }

  private async goToApiOnly() {
    let page = 0
    while (true) {
      try {
        const result = await this.fetchFromApi(page)
        const dataEvent = new CustomEvent<Type>('data', {
          detail: result
        })
        this.dispatchEvent(dataEvent)
        await this.saveInDb(result)
        page++
      } catch (error: any) {
        const code: string =
          error.code || error.response?.data?.code || 'Unknoow Error'
        if (code === 'NotFoundMusics' && page > 0) break
        else if (this.networkState === 'db first' || page > 0) {
          const dataEvent = new CustomEvent<string>('error', {
            detail: 'NotLoadAllMusics'
          })
          this.dispatchEvent(dataEvent)
          break
        } else {
          const dataEvent = new CustomEvent<string>('error', { detail: code })
          this.dispatchEvent(dataEvent)
          break
        }
      }
    }
  }

  private async goToDbFirst() {
    await this.goToDbOnly()
    this.goToApiOnly()
  }

  private async goToDbOnly() {
    const result = await this.fetchFromDb()
    const dataEvent = new CustomEvent<Type>('data', {
      detail: result
    })
    this.dispatchEvent(dataEvent)
  }

  private fetchFromApi(page: number) {
    return new Promise<Type>((resolve, reject) => {
      const { withAlbum, withArtist } = this.options
      const musicId = this.musicId

      api
        .get<Type>(`/music/${musicId}`, {
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

  private async fetchFromDb(): Promise<Type> {
    const { withAlbum, withArtist } = this.options
    const id = this.musicId
    const database = new DatabaseManager()
    await database.open()
    const { albumId, artistId, ...rest } = (await database.getObject(
      'musics',
      id
    )) as Music
    const result: any = rest

    if (withArtist) {
      const artist = await database.getObject('artists', artistId)
      result.artist = artist
    } else {
      result.artistId = artistId
    }

    if (withAlbum) {
      const album = await database.getObject('albums', albumId)
      result.album = album
    } else {
      result.albumId = albumId
    }

    return result
  }

  private async saveInDb(result: Type) {
    const {
      id,
      name,
      createdAt,
      discNumber,
      spotifyId,
      trackNumber,
      youtubeId,
      lyrics
    } = result

    const music: any = {
      id,
      name,
      createdAt,
      discNumber,
      spotifyId,
      trackNumber,
      youtubeId,
      lyrics
    }
    const database = new DatabaseManager()
    await database.open()

    if ('album' in result) {
      await database.addObject(result.album, 'albums')
      music.albumId = result.album.id
    } else {
      music.albumId = result.albumId
    }

    if ('artist' in result) {
      await database.addObject(result.artist, 'artists')
      music.artistId = result.artist.id
    } else {
      music.artistId = result.artistId
    }
    await database.addObject(music, 'musics')
  }

  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions
  ): void

  addEventListener(
    type: 'data',
    callback: EspecialEventListenerOrEventListenerObject<Type> | null,
    options?: boolean | AddEventListenerOptions
  ): void

  addEventListener(
    type: 'error',
    callback: EspecialEventListenerOrEventListenerObject<string> | null,
    options?: boolean | AddEventListenerOptions
  ): void

  addEventListener(type: any, callback: any, options?: any): void {
    super.addEventListener(type, callback, options)
  }
}
