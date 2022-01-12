import { AppError } from './AppError'

export class NotFoundPlaylistItem extends AppError {
  constructor() {
    super('NotFoundPlaylistItem', 'Not found music in playlist!', 404)
  }
}
