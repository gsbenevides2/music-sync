export function runVersion2(upgradeTransaction: IDBTransaction) {
  console.log('logo')
  function updateMusicsPlaylitsts() {
    const objectStore = upgradeTransaction.objectStore('musics_playlists')

    objectStore.deleteIndex('youtubeId')
    objectStore.deleteIndex('spotifyId')
    objectStore.createIndex('musicId', 'musicId', { unique: true })
  }

  updateMusicsPlaylitsts()
}
