import { AppError } from './AppError'

export class SpotifyUnknownError extends AppError {
  constructor() {
    super('SpotifyUnknownError', '', 400)
  }
}
