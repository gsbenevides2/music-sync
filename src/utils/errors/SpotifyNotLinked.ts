import { AppError } from './AppError'

export class SpotifyNotLinked extends AppError {
  constructor() {
    super('SpotifyNotLinked', 'You Spotify account is not linked', 400)
  }
}
