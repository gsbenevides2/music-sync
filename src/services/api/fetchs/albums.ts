import { DatabaseManager } from '../../database/database'
import api from '../api'
import { Album } from '../apiTypes'
import {
  EventListenerOrEventListenerObject,
  AddEventListenerOptions,
  EspecialEventListenerOrEventListenerObject
} from './types'
import { getNetworkState, NetworkState } from './utils'

export class FetchAlbums extends EventTarget {
  networkState: NetworkState
  constructor() {
    super()
    this.networkState = getNetworkState()
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
        const dataEvent = new CustomEvent<Album[]>('data', {
          detail: result
        })
        this.dispatchEvent(dataEvent)
        await this.saveInDb(result)
        page++
      } catch (error: any) {
        const code: string =
          error.code || error.response?.data?.code || 'Unknoow Error'
        if (code === 'NotFoundAlbums' && page > 0) break
        else if (this.networkState === 'db first' || page > 0) {
          const dataEvent = new CustomEvent<string>('error', {
            detail: 'NotLoadAllAlbums'
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
    const dataEvent = new CustomEvent<Album[]>('data', {
      detail: result
    })
    this.dispatchEvent(dataEvent)
  }

  private fetchFromApi(page: number) {
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

  private async fetchFromDb(): Promise<Album[]> {
    const database = new DatabaseManager()
    await database.open()

    const albums: Album[] = await database.getObjects('albums')
    return albums
  }

  private async saveInDb(albums: Album[]) {
    const database = new DatabaseManager()
    await database.open()

    await database.addObjects(albums, 'albums')
  }

  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions
  ): void

  addEventListener(
    type: 'data',
    callback: EspecialEventListenerOrEventListenerObject<Album[]> | null,
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
