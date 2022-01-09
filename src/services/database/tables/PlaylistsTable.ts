import { DATA_TYPE, ITable } from 'jsstore'

export const PlaylistsTable: ITable = {
  name: 'playlists',
  columns: {
    id: {
      primaryKey: true,
      notNull: true,
      unique: true,
      dataType: DATA_TYPE.String,
      enableSearch: true
    },
    name: {
      dataType: DATA_TYPE.String,
      notNull: true
    },
    spotifyId: {
      unique: true,
      dataType: DATA_TYPE.String
    },
    youtubeId: {
      unique: true,
      dataType: DATA_TYPE.String
    },
    createdAt: {
      dataType: DATA_TYPE.String,
      notNull: true
    }
  }
}
