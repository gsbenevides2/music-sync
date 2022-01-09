export class AppError extends Error {
  code: string
  message: string
  status: number
  constructor(code: string, message: string, status: number) {
    super()
    this.code = code
    this.message = message
    this.status = status
  }

  toJson() {
    return {
      code: this.code,
      message: this.message
    }
  }
}
