import { AppError } from './AppError'

export class NotFoundSession extends AppError {
  constructor() {
    super('NotFoundSession', 'Session not found!', 401)
  }
}
