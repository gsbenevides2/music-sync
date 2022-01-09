import { getDatabase } from '../../database'
import api from '../api'
import {
  Music,
  MusicWithAlbum,
  MusicWithArtistAndAlbum,
  MusicWithArtist,
  Artist,
  Album,
  PlaylistItem
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
  findByPlaylistId?: string
}

type ResultNotArray =
  | Music
  | MusicWithAlbum
  | MusicWithArtist
  | MusicWithArtistAndAlbum

export class FetchMusics<Type extends ResultNotArray> extends EventTarget {
  options: OptionsMusics
  networkState: NetworkState
  dbResult: Type[] = []
  apiResult: Type[] = []
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
    else if (networkState === 'offline') this.networkError()
  }

  private networkError() {
    const dataEvent = new CustomEvent<string>('error', { detail: 'Offline' })
    this.dispatchEvent(dataEvent)
  }

  private async goToApiOnly() {
    let page = 0
    let save = false
    while (true) {
      try {
        const result = await this.fetchFromApi(page)
        const dataEvent = new CustomEvent<Type[]>('data', {
          detail: result
        })
        this.dispatchEvent(dataEvent)
        this.apiResult = [...this.apiResult, ...result]
        page++
      } catch (error: any) {
        const code: string =
          error.code || error.response?.data?.code || 'Unknoow Error'
        if (code === 'NotFoundMusics' && page > 0) {
          save = true
          break
        } else if (this.networkState === 'db first' || page > 0) {
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

    if (save) await this.saveInDb()
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
      const {
        withAlbum,
        withArtist,
        findByAlbumId,
        findByArtistId,
        findByPlaylistId
      } = this.options

      let url
      if (findByAlbumId) url = `/album/${findByAlbumId}/musics`
      else if (findByArtistId) url = `/artist/${findByArtistId}/musics`
      else if (findByPlaylistId) url = `/playlist/${findByPlaylistId}/musics`
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
    const {
      withAlbum,
      withArtist,
      findByArtistId,
      findByAlbumId,
      findByPlaylistId
    } = this.options

    const database = await getDatabase()

    let musics: Music[]
    if (findByArtistId) {
      musics = await database.select<Music>({
        from: 'musics',
        where: {
          artistId: findByPlaylistId as string
        }
      })
    } else if (findByAlbumId) {
      musics = await database.select<Music>({
        from: 'musics',
        where: {
          albumId: findByAlbumId as string
        }
      })
    } else if (findByPlaylistId) {
      const musicsOnPlaylist = await database.select<PlaylistItem>({
        from: 'musics_playlists',
        where: { playlistId: findByPlaylistId as string }
      })
      const musicsIds = musicsOnPlaylist[0].musics
      musics = await database.select<Music>({
        from: 'musics',
        where: {
          id: {
            in: musicsIds
          }
        }
      })
    } else {
      musics = await database.select<Music>({
        from: 'musics'
      })
    }

    const artists = withArtist
      ? await database.select<Artist>({ from: 'artists' })
      : []

    const albums = withAlbum
      ? await database.select<Album>({ from: 'albums' })
      : []

    const result = musics.map(music => {
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
    this.dbResult = result
    return result
  }

  private async saveInDb() {
    const deleteValues: Type[] = []
    const updateValues: Type[] = []

    this.dbResult.forEach(result => {
      if (this.apiResult.findIndex(test => test.id === result.id) !== -1) {
        updateValues.push(result)
      } else deleteValues.push(result)
    })

    const database = await getDatabase()

    const artists: Artist[] = []
    const albums: Album[] = []

    const musicsUpdate: Music[] = updateValues.map(m => {
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

    const musicsDelete: string[] = deleteValues.map(m => {
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

      return m.id
    })

    await Promise.all([
      database.insert({
        into: 'artists',
        values: artists,
        upsert: true
      }),
      database.insert({
        into: 'albums',
        values: albums,
        upsert: true
      }),
      database.insert({
        into: 'musics',
        values: musicsUpdate,
        upsert: true
      }),
      database.remove({
        from: 'musics',
        where: {
          id: { in: musicsDelete }
        }
      })
    ])

    if (this.options.findByPlaylistId) {
      const playlistMusicsUpdates: PlaylistItem = {
        playlistId: this.options.findByPlaylistId,
        musics: this.apiResult.map(value => value.id)
      }

      await database.insert({
        into: 'musics_playlists',
        values: [playlistMusicsUpdates],
        upsert: true
      })
    }
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
    else if (networkState === 'offline') this.networkError()
  }

  private networkError() {
    const dataEvent = new CustomEvent<string>('error', { detail: 'Offline' })
    this.dispatchEvent(dataEvent)
  }

  private async goToApiOnly() {
    try {
      const result = await this.fetchFromApi()
      const dataEvent = new CustomEvent<Type>('data', {
        detail: result
      })
      this.dispatchEvent(dataEvent)
      await this.saveInDb(result)
    } catch (error: any) {
      const code: string =
        error.code || error.response?.data?.code || 'Unknoow Error'

      const dataEvent = new CustomEvent<string>('error', { detail: code })
      this.dispatchEvent(dataEvent)
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

  private fetchFromApi() {
    return new Promise<Type>((resolve, reject) => {
      const { withAlbum, withArtist } = this.options
      const musicId = this.musicId

      api
        .get<Type>(`/music/${musicId}`, {
          method: 'get',
          params: {
            withAlbum,
            withArtist
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
    const database = await getDatabase()

    const musics = await database.select<Music>({
      from: 'musics',
      where: { id }
    })
    const { albumId, artistId, ...rest } = musics[0]
    const result: any = rest

    if (withArtist) {
      const artists = await database.select<Artist>({
        from: 'artists',
        where: { id: artistId }
      })
      result.artist = artists[0]
    } else {
      result.artistId = artistId
    }

    if (withAlbum) {
      const albums = await database.select<Album>({
        from: 'albums',
        where: { id: albumId }
      })
      result.album = albums[0]
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
    const database = await getDatabase()

    if ('album' in result) {
      await database.insert({
        into: 'albums',
        values: [result.album],
        upsert: true
      })
      music.albumId = result.album.id
    } else {
      music.albumId = result.albumId
    }

    if ('artist' in result) {
      await database.insert({
        into: 'artists',
        values: [result.artist],
        upsert: true
      })
      music.artistId = result.artist.id
    } else {
      music.artistId = result.artistId
    }
    await database.insert({
      into: 'musics',
      values: [music],
      upsert: true
    })
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
