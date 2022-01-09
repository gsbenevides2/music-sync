import { AppError } from './AppError'

export class YoutubeLoginInvalid extends AppError {
  constructor() {
    super(
      'YoutubeLoginInvalid',
      'Error when trying to authenticate on YouTube, try again.',
      400
    )
  }
}
