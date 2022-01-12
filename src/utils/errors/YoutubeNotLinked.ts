import { AppError } from './AppError'

export class YoutubeNotLinked extends AppError {
  constructor() {
    super('YoutubeNotLinked', 'You Youtube account is not linked', 400)
  }
}
