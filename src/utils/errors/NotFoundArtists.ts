import { AppError } from './AppError'

export class NotFoundArtists extends AppError {
  constructor() {
    super('NotFoundArtists', 'Not Found Artists', 404)
  }
}
