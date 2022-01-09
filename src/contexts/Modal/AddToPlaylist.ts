import api from '../../services/api/api'

export function addToPlaylist(playlistId: string, musicId: string) {
  return new Promise<void>((resolve, reject) => {
    api
      .post(`/playlist/${playlistId}/addMusic`, { musicId })
      .then(() => {
        resolve()
      })
      .catch(error => {
        reject(error)
      })
  })
}
