import { AppError } from '../../utils/error'

export class PlaylistItemNotFound extends AppError {
  constructor() {
    super('PlaylistItemNotFound', 'Music not found in playlist!', 404)
  }
}
export class NotFoundPlaylists extends AppError {
  constructor() {
    super('NotFoundPlaylists', 'Not Found Playlists', 404)
  }
}
export class PlaylistNotFound extends AppError {
  constructor() {
    super('PlaylistNotFound', 'Playlist not found!', 404)
  }
}

export class SongAlreadyPlaylist extends AppError {
  constructor() {
    super('SongAlreadyPlaylist', 'The song is already on the playlist.', 400)
  }
}
