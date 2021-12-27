import { AppError } from '../../utils/error'

export class SessionNotFound extends AppError {
  constructor() {
    super('SessionNotFound', 'Session not found!', 401)
  }
}

export class InvalidGithubUser extends AppError {
  constructor() {
    super(
      'InvalidGithubUser',
      'The user you identified on github is not allowed to use this system.',
      401
    )
  }
}

export class TokenInvalid extends AppError {
  constructor() {
    super('TokenInvalid', 'Invalid Token!', 401)
  }
}
