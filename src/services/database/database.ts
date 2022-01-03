import { runVersion1 } from './upgrades/version1'

export class DatabaseManager {
  db?: IDBDatabase
  open() {
    return new Promise<void>(resolve => {
      const dbRequest = window.indexedDB.open('Music-Sync', 1)
      dbRequest.onupgradeneeded = e => {
        this.db = dbRequest.result
        this.upgradeDb()
      }
      dbRequest.onsuccess = () => {
        this.db = dbRequest.result
        resolve()
      }
    })
  }

  upgradeDb() {
    runVersion1(this.db as IDBDatabase)
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
}
