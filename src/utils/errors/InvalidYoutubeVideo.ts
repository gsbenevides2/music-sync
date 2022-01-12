import { AppError } from './AppError'

export class InvalidYoutubeVideo extends AppError {
  constructor() {
    super('InvalidYoutubeVideo', 'Invalid Youtube Video', 400)
  }
}
