import { AppError } from '../../utils/error'

export class SpotifySecureIdInvalid extends AppError {
  constructor() {
    super('SpotifySecureIdInvalid', 'Invalid security ID!', 400)
  }
}
export class SpotifyNotLinked extends AppError {
  constructor() {
    super('SpotifyNotLinked', 'You Spotify account is not linked', 400)
  }
}

export class SpotifyUnknownError extends AppError {
  constructor() {
    super('SpotifyUnknownError', '', 400)
  }
}
