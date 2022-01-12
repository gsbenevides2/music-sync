import { DATA_TYPE, ITable } from 'jsstore'

export const MusicsPlaylistsTable: ITable = {
  name: 'musics_playlists',
  columns: {
    playlistId: {
      primaryKey: true,
      dataType: DATA_TYPE.String,
      notNull: true,
      unique: true
    },
    musics: {
      notNull: true,
      dataType: DATA_TYPE.Array
    }
  }
}
