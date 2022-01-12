export function runVersion3(upgradeTransaction: IDBTransaction) {
  console.log('logo')
  function updateMusicsPlaylitsts() {
    const objectStore = upgradeTransaction.objectStore('musics_playlists')

    objectStore.deleteIndex('musicId')
    objectStore.createIndex('musicId', 'musicId', { unique: false })
  }

  updateMusicsPlaylitsts()
}
