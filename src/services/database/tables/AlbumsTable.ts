import {ITable, DATA_TYPE} from 'jsstore'

export const AlbumsTable: ITable = {
  name: 'albums',
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
      dataType: DATA_TYPE.String,
      notNull: true
    },
    spotifyCoverUrl: {
      dataType: DATA_TYPE.String
    },
    spotifyYear: {
      dataType: DATA_TYPE.String
    },
    createdAt: {
      dataType: DATA_TYPE.String,
      notNull: true
    }
  }
}


