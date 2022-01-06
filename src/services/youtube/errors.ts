import { AppError } from '../../utils/error'

export class YoutubeNotLinked extends AppError {
  constructor() {
    super('YoutubeNotLinked', 'You Youtube account is not linked', 400)
  }
}

export class YoutubeLoginInvalid extends AppError {
  constructor() {
    super(
      'YoutubeLoginInvalid',
      'Error when trying to authenticate on YouTube, try again.',
      400
    )
  }
}

export class YoutubeSecureIdInvalid extends AppError {
  constructor() {
    super('YoutubeSecureIdInvalid', 'Invalid security ID!', 400)
  }
}

export class YoutubeAccountInvalid extends AppError {
  constructor() {
    super('YoutubeAccountInvalid', 'YouTube account invalidates!', 400)
  }
}
