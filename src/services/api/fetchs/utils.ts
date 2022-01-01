import { getSetting } from '../../../utils/settings'
import { OFFLINE_KEY, OFFLINE_PRIORITY_KEY } from '../../../utils/settings/keys'

class OfflineError extends Error {
  code = 'Offline'
}

export class NotMoreError extends Error {
  code = 'NotMoreError'
}

export function networkTest() {
  return new Promise<'api first' | 'db only' | 'db first'>(
    (resolve, reject) => {
      const offline = getSetting(OFFLINE_KEY)
      const offlinePriority = getSetting(OFFLINE_PRIORITY_KEY)
      const onLine = navigator.onLine

      if (onLine) {
        if (offlinePriority) resolve('db first')
        else resolve('api first')
      } else {
        if (offline) resolve('db only')
        else reject(new OfflineError())
      }
    }
  )
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
