import { AppError } from './AppError'

export class YoutubeAccountInvalid extends AppError {
  constructor() {
    super('YoutubeAccountInvalid', 'YouTube account invalidates!', 400)
  }
}
