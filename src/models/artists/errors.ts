import { AppError } from '../../utils/error'

export class NotFoundArtists extends AppError {
  constructor() {
    super('NotFoundArtists', 'Not Found Artists', 404)
  }
}
