import { Connection, IDataBase } from 'jsstore'

import { AlbumsTable } from './tables/AlbumsTable'
import { ArtistsTable } from './tables/ArtistsTable'
import { MusicsPlaylistsTable } from './tables/MusicsPlaylists'
import { MusicsTable } from './tables/MusicsTable'
import { PlaylistsTable } from './tables/PlaylistsTable'

const getWorkerPath = () => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line import/no-webpack-loader-syntax
    return require('file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.js')
  } else {
    // eslint-disable-next-line import/no-webpack-loader-syntax
    return require('file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.min.js')
  }
}

function deleteOldDatabase() {
  return new Promise<void>(resolve => {
    const request = indexedDB.deleteDatabase('Music-Sync')
    request.onsuccess = () => resolve()
    request.onerror = () => resolve()
  })
}

export async function getDatabase() {
  await deleteOldDatabase()

  const workerPath = getWorkerPath().default
  const connection = new Connection(new Worker(workerPath))
  const databaseStructure: IDataBase = {
    name: 'MusicSync',
    tables: [
      ArtistsTable,
      AlbumsTable,
      MusicsTable,
      PlaylistsTable,
      MusicsPlaylistsTable
    ]
  }
  await connection.initDb(databaseStructure)
  return connection
}
