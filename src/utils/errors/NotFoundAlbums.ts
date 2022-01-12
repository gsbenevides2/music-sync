import { AppError } from './AppError'

export class NotFoundAlbums extends AppError {
  constructor() {
    super('NotFoundAlbums', 'Not Found Albums', 404)
  }
}
