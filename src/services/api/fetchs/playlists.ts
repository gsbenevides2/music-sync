import { getDatabase } from '../../database'
import api from '../api'
import { Playlist } from '../apiTypes'
import {
  EventListenerOrEventListenerObject,
  AddEventListenerOptions,
  EspecialEventListenerOrEventListenerObject
} from './types'
import { getNetworkState, NetworkState } from './utils'

export class FetchPlaylists extends EventTarget {
  networkState: NetworkState
  dbResult: Playlist[] = []
  apiResult: Playlist[] = []
  constructor() {
    super()
    this.networkState = getNetworkState()
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
      const dataEvent = new CustomEvent<Playlist[]>('data', {
        detail: result
      })
      this.dispatchEvent(dataEvent)
      this.apiResult = result
      await this.saveInDb()
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
    const dataEvent = new CustomEvent<Playlist[]>('data', {
      detail: result
    })
    this.dispatchEvent(dataEvent)
  }

  private fetchFromApi() {
    return new Promise<Playlist[]>((resolve, reject) => {
      api
        .get<Playlist[]>('/playlists', {
          method: 'get'
        })
        .then(response => {
          resolve(response.data)
        })
        .catch(reject)
    })
  }

  private async fetchFromDb(): Promise<Playlist[]> {
    const database = await getDatabase()

    const playlists: Playlist[] = await database.select({
      from: 'playlists'
    })
    this.dbResult = playlists
    return playlists
  }

  private async saveInDb() {
    const deleteValues: string[] = []
    const updateValues: Playlist[] = []

    this.dbResult.forEach(result => {
      if (this.apiResult.findIndex(test => test.id === result.id) !== -1) {
        updateValues.push(result)
      } else deleteValues.push(result.id)
    })

    const database = await getDatabase()

    await database.insert({
      into: 'playlists',
      values: updateValues,
      upsert: true
    })

    await database.remove({
      from: 'playlists',
      where: {
        id: { in: deleteValues }
      }
    })
  }

  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions
  ): void

  addEventListener(
    type: 'data',
    callback: EspecialEventListenerOrEventListenerObject<Playlist[]> | null,
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

export class FetchPlaylist extends EventTarget {
  networkState: NetworkState
  playlistId: string
  constructor(playlistId: string) {
    super()
    this.networkState = getNetworkState()
    this.playlistId = playlistId
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
      const dataEvent = new CustomEvent<Playlist>('data', {
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
    const dataEvent = new CustomEvent<Playlist>('data', {
      detail: result
    })
    this.dispatchEvent(dataEvent)
  }

  private fetchFromApi() {
    return new Promise<Playlist>((resolve, reject) => {
      const playlistId = this.playlistId

      api
        .get<Playlist>(`/playlist/${playlistId}`, {
          method: 'get'
        })
        .then(response => {
          resolve(response.data)
        })
        .catch(reject)
    })
  }

  private async fetchFromDb(): Promise<Playlist> {
    const id = this.playlistId
    const database = await getDatabase()

    const playlists = await database.select<Playlist>({
      from: 'playlists',
      where: { id }
    })

    return playlists[0]
  }

  private async saveInDb(result: Playlist) {
    const database = await getDatabase()

    await database.insert({
      into: 'playlists',
      values: [result],
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
    callback: EspecialEventListenerOrEventListenerObject<Playlist> | null,
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
