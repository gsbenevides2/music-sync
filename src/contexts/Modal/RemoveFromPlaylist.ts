import api from '../../services/api/api'
import { PlaylistItem } from '../../services/api/apiTypes'
import { getDatabase } from '../../services/database'

export async function RemoveFromPlaylist(playlistId: string, musicId: string) {
  return new Promise<void>((resolve, reject) => {
    api
      .delete(`/playlist/${playlistId}/${musicId}`)
      .then(async () => {
        const database = await getDatabase()
        const [playlist] = await database.select<PlaylistItem>({
          from: 'musics_playlists',
          where: { playlistId }
        })
        const { musics } = playlist
        musics.splice(musics.findIndex(t => t === musicId))
        await database.update({
          in: 'musics_playlists',
          set: { musics },
          where: { playlistId }
        })
        resolve()
      })
      .catch(reject)
  })
}
