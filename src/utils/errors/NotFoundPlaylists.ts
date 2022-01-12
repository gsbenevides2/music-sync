import { AppError } from './AppError'

export class NotFoundPlaylists extends AppError {
  constructor() {
    super('NotFoundPlaylists', 'Not Found Playlists', 404)
  }
}
