export function runVersion3(upgradeTransaction: IDBTransaction) {
  function updateMusicsPlaylitsts() {
    const objectStore = upgradeTransaction.objectStore('musics_playlists')

    objectStore.deleteIndex('musicId')
    objectStore.createIndex('musicId', 'musicId', { unique: false })
  }

  updateMusicsPlaylitsts()
}
