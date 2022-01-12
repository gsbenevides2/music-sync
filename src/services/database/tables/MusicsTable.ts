import { DATA_TYPE, ITable } from 'jsstore'

export const MusicsTable: ITable = {
  name: 'musics',
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
    artistId: {
      dataType: DATA_TYPE.String,
      notNull: true
    },
    albumId: {
      dataType: DATA_TYPE.String,
      notNull: true
    },
    youtubeId: {
      unique: true,
      dataType: DATA_TYPE.String,
      notNull: true
    },
    spotifyId: {
      unique: true,
      dataType: DATA_TYPE.String,
      notNull: true
    },
    trackNumber: {
      dataType: DATA_TYPE.String
    },
    discNumber: {
      dataType: DATA_TYPE.String
    },
    lyrics: {
      dataType: DATA_TYPE.String
    },
    createdAt: {
      dataType: DATA_TYPE.String,
      notNull: true
    }
  }
}
