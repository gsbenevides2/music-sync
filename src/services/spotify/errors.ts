import { AppError } from '../../utils/error'

export class SpotifySecureIdInvalid extends AppError {
  constructor() {
    super('SpotifySecureIdInvalid', 'Invalid security ID!', 400)
  }
}
