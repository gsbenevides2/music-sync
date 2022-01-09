import { AppError } from './AppError'

export class TokenInvalid extends AppError {
  constructor() {
    super('TokenInvalid', 'Invalid Token!', 401)
  }
}
