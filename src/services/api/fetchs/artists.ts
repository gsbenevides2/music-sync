import { DatabaseManager } from '../../database/database'
import api from '../api'
import { Artist } from '../apiTypes'
import {
  EventListenerOrEventListenerObject,
  AddEventListenerOptions,
  EspecialEventListenerOrEventListenerObject
} from './types'
import { getNetworkState, NetworkState, orderByName } from './utils'

export class FetchArtists extends EventTarget {
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

        const ordenedResult = await orderByName<Artist>(result)
        const dataEvent = new CustomEvent<Artist[]>('data', {
          detail: ordenedResult
        })
        this.dispatchEvent(dataEvent)
        await this.saveInDb(ordenedResult)
        page++
      } catch (error: any) {
        const code: string =
          error.code || error.response?.data?.code || 'Unknoow Error'
        if (code === 'NotFoundArtists' && page > 0) break
        else if (this.networkState === 'db first' || page > 0) {
          const dataEvent = new CustomEvent<string>('error', {
            detail: 'NotLoadAllArtists'
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

    const ordenedResult = await orderByName<Artist>(result)
    const dataEvent = new CustomEvent<Artist[]>('data', {
      detail: ordenedResult
    })
    this.dispatchEvent(dataEvent)
  }

  private fetchFromApi(page: number) {
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

  private async fetchFromDb(): Promise<Artist[]> {
    const database = new DatabaseManager()
    await database.open()

    const albums: Artist[] = await database.getObjects('artists')
    return albums
  }

  private async saveInDb(albums: Artist[]) {
    const database = new DatabaseManager()
    await database.open()

    await database.addObjects(albums, 'artists')
  }

  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions
  ): void

  addEventListener(
    type: 'data',
    callback: EspecialEventListenerOrEventListenerObject<Artist[]> | null,
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
