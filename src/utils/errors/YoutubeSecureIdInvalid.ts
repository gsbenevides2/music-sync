import { AppError } from './AppError'

export class YoutubeSecureIdInvalid extends AppError {
  constructor() {
    super('YoutubeSecureIdInvalid', 'Invalid security ID!', 400)
  }
}
