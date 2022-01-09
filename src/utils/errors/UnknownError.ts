import { AppError } from './AppError'

export class UnknownError extends AppError {
  constructor() {
    super('UnknownError', 'An unexpected system error has occurred!', 500)
  }
}
