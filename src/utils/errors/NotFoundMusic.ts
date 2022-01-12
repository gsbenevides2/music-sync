import { AppError } from './AppError'

export class NotFoundMusic extends AppError {
  constructor() {
    super('NotFoundMusic', 'Not Found Music', 404)
  }
}
