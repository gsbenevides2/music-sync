export const algo = null

/*
import { getSettingString, setSetting } from '../../utils/settings'
import { DB_VERSION_KEY } from '../../utils/settings/keys'
import { runVersion1 } from './upgrades/version1'
import { runVersion2 } from './upgrades/version2'
import { runVersion3 } from './upgrades/version3'

export class DatabaseManager {
  db?: IDBDatabase
  version = 3
  migrations = [runVersion1, runVersion2,runVersion3]

  open() {
    return new Promise<void>(resolve => {
      const dbRequest = window.indexedDB.open('Music-Sync', this.version)
      dbRequest.onupgradeneeded = e => {
        this.db = dbRequest.result

        const upgradeTransaction = dbRequest.transaction
        this.upgradeDb(upgradeTransaction as IDBTransaction)
      }
      dbRequest.onsuccess = () => {
        this.db = dbRequest.result
        resolve()
      }
    })
  }

  upgradeDb(upgradeTransaction: IDBTransaction) {
    if (!this.db?.objectStoreNames.contains('musics')) {
      runVersion1(upgradeTransaction)
      console.log('foi')
    }

    let nextVersion = (Number(getSettingString(DB_VERSION_KEY)) | 1) + 1
    console.log('lb', nextVersion)
    for (; nextVersion <= this.version; nextVersion++) {
      console.log('la', nextVersion)
      this.migrations[nextVersion - 1](upgradeTransaction)
    }
    console.log('li')
    setSetting(DB_VERSION_KEY, this.version.toString())
  }

  addObject(object: any, storeName: string) {
    const db = this.db
    if (db === undefined) throw new Error('Please call open()')
    return new Promise<void>(resolve => {
      const store = db
        .transaction(storeName, 'readwrite')
        .objectStore(storeName)
      const request = store.put(object)
      request.onerror = console.error
      request.onsuccess = () => {
        resolve()
      }
    })
  }

  addObjects(objects: any[], storeName: string) {
    const db = this.db
    if (db === undefined) throw new Error('Please call open()')

    const store = db.transaction(storeName, 'readwrite').objectStore(storeName)
    return Promise.all(
      objects.map(object => {
        return new Promise<void>(resolve => {
          const request = store.put(object)
          request.onerror = console.error
          request.onsuccess = () => {
            resolve()
          }
        })
      })
    )
  }

  getObject(storeName: string, id: string) {
    const db = this.db
    if (db === undefined) throw new Error('Please call open()')

    const store = db.transaction(storeName, 'readwrite').objectStore(storeName)

    return new Promise<any>(resolve => {
      const request = store.get(id)
      request.onsuccess = () => {
        resolve(request.result)
      }
    })
  }

  getObjects(storeName: string) {
    const db = this.db
    if (db === undefined) throw new Error('Please call open()')

    const store = db.transaction(storeName, 'readwrite').objectStore(storeName)

    return new Promise<any>(resolve => {
      const request = store.getAll()
      request.onsuccess = () => {
        resolve(request.result)
      }
    })
  }

  getObjectsUsingFilter(storeName: string, param: string, value: string) {
    const db = this.db
    if (db === undefined) throw new Error('Please call open()')

    const store = db.transaction(storeName, 'readwrite').objectStore(storeName)
    const index = store.index(param)

    return new Promise<any>(resolve => {
      const request = index.getAll(value)
      request.onsuccess = () => {
        resolve(request.result)
      }
    })
  }

  deleteObject(id: string, storeName: string) {
    const db = this.db
    if (db === undefined) throw new Error('Please call open()')

    const store = db.transaction(storeName, 'readwrite').objectStore(storeName)

    return new Promise<void>(resolve => {
      store.delete(id)
      store.transaction.oncomplete = () => {
        resolve()
      }
    })
  }

  deleteObjects(ids: string[], storeName: string) {
    const db = this.db
    if (db === undefined) throw new Error('Please call open()')

    const store = db.transaction(storeName, 'readwrite').objectStore(storeName)

    return new Promise<void>(resolve => {
      ids.forEach(id => {
        store.delete(id)
      })

      store.transaction.oncomplete = () => {
        resolve()
      }
    })
  }
}
*/
