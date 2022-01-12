import api from '../../services/api/api'
import { getDatabase } from '../../services/database'

export async function DeleteMusic(musicId: string) {
  return new Promise<void>((resolve, reject) => {
    api
      .delete(`/music/${musicId}`)
      .then(async response => {
        resolve()
        const database = await getDatabase()
        await database.remove({
          from: 'musics',
          where: { id: musicId }
        })
      })
      .catch(e => {
        reject(e)
      })
  })
}
