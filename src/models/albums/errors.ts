import { AppError } from '../../utils/error'

export class NotFoundAlbums extends AppError {
  constructor() {
    super('NotFoundAlbums', 'Not Found Albums', 404)
  }
}
