import { AppError } from './AppError'

export class MusicAlreadyExists extends AppError {
  id: string
  constructor(id: string) {
    super('MusicAlreadyExists', 'Music already exists.', 400)
    this.id = id
  }

  toJson() {
    const obj = super.toJson()
    return {
      ...obj,
      id: this.id
    }
  }
}
