import { AppError } from './AppError'

export class DownloadError extends AppError {
  constructor() {
    super('DownloadError', 'Error ind download music', 500)
  }
}
