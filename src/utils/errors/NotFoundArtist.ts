import { AppError } from './AppError'

export class NotFoundArtist extends AppError {
  constructor() {
    super('NotFoundArtist', 'Not Found Album', 404)
  }
}
