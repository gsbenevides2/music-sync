import { AppError } from './AppError'

export class InvalidGithubUser extends AppError {
  constructor() {
    super(
      'InvalidGithubUser',
      'The user you identified on github is not allowed to use this system.',
      401
    )
  }
}
