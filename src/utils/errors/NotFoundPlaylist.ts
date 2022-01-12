import { AppError } from './AppError'

export class NotFoundPlaylist extends AppError {
  constructor() {
    super('NotFoundPlaylist', 'Not Found Playlist', 404)
  }
}
