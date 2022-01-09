import { AppError } from './AppError'

export class NotFoundAlbum extends AppError {
  constructor() {
    super('NotFoundAlbum', 'Not Found Album', 404)
  }
}
