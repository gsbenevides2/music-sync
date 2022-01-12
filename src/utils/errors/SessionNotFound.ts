import { AppError } from './AppError'

export class SessionNotFound extends AppError {
  constructor() {
    super('SessionNotFound', 'Session not found!', 404)
  }
}
