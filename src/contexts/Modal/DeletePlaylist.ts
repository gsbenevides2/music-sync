import api from '../../services/api/api'
import { getDatabase } from '../../services/database'

export async function DeletePlaylist(playlistId: string) {
  return new Promise<void>((resolve, reject) => {
    api
      .delete(`/playlist/${playlistId}`)
      .then(async response => {
        resolve()
        const database = await getDatabase()
        await database.remove({
          from: 'playlists',
          where: { id: playlistId }
        })
        await database.remove({
            from:'musics_playlists',
            where:{playlistId}
        })
      })
      .catch(e => {
        reject(e)
      })
  })
}
