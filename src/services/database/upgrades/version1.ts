export async function runVersion1(upgradeTransaction: IDBTransaction) {
  const db = upgradeTransaction.db
  function createArtistsStore() {
    const store = db.createObjectStore('artists', {
      keyPath: 'id'
    })
    store.createIndex('name', 'name', { unique: false })
    store.createIndex('spotifyId', 'spotifyId', { unique: true })
    store.createIndex('spotifyGenre', 'spotifyGenre', { unique: false })
  }
  function createAlbumStore() {
    const store = db.createObjectStore('albums', { keyPath: 'id' })
    store.createIndex('name', 'name', { unique: false })
    store.createIndex('spotifyId', 'spotifyId', { unique: true })
  }
  function createMusicStore() {
    const store = db.createObjectStore('musics', { keyPath: 'id' })
    store.createIndex('name', 'name', { unique: false })
    store.createIndex('artistId', 'artistId', { unique: false })
    store.createIndex('albumId', 'albumId', { unique: false })
    store.createIndex('youtubeId', 'youtubeId', { unique: true })
    store.createIndex('spotifyId', 'spotifyId', { unique: true })
  }
  function createPlaylistsStore() {
    const store = db.createObjectStore('playlists', { keyPath: 'id' })
    store.createIndex('name', 'name', { unique: false })
    store.createIndex('youtubeId', 'youtubeId', { unique: true })
    store.createIndex('spotifyId', 'spotifyId', { unique: true })
  }

  function createMusicsPlaylistsStore() {
    const store = db.createObjectStore('musics_playlists')
    store.createIndex('playlistId', 'playlistId', { unique: false })
    store.createIndex('youtubeId', 'youtubeId', { unique: false })
    store.createIndex('spotifyId', 'spotifyId', { unique: false })
  }

  createArtistsStore()
  createAlbumStore()
  createMusicStore()
  createPlaylistsStore()
  createMusicsPlaylistsStore()
}
