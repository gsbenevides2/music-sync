import { AppError } from './AppError'

export class SongAlreadyPlaylist extends AppError {
  constructor() {
    super('SongAlreadyPlaylist', 'The song is already on the playlist.', 400)
  }
}
