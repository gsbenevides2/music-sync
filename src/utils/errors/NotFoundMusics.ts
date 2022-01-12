import { AppError } from './AppError'

export class NotFoundMusics extends AppError {
  constructor() {
    super('NotFoundMusics', 'Not Found Musics', 404)
  }
}
