import { getSetting } from '../../../utils/settings'
import { OFFLINE_KEY, OFFLINE_PRIORITY_KEY } from '../../../utils/settings/keys'

export class NotMoreError extends Error {
  code = 'NotMoreError'
}

export type NetworkState = 'api only' | 'db only' | 'db first' | 'offline'
export function getNetworkState(): NetworkState {
  const offline = getSetting(OFFLINE_KEY)
  const offlinePriority = getSetting(OFFLINE_PRIORITY_KEY)
  const onLine = navigator.onLine

  if (onLine) {
    if (offline && offlinePriority) return 'db first'
    else return 'api only'
  } else {
    if (offline) return 'db only'
    else return 'offline'
  }
}
type OrderValue = { name: string }

export function orderByName<T extends OrderValue>(value: T[]): Promise<T[]> {
  return new Promise(resolve => {
    value.sort((a, b) => {
      if (a.name > b.name) {
        return 1
      }
      if (a.name < b.name) {
        return -1
      }
      // a must be equal to b
      return 0
    })
    resolve(value)
  })
}
