import { Server } from 'http'
import { Server as SocketIoServer } from 'socket.io'

import { AuthModel } from './models/auth'
import { Downloader } from './utils/download'
import { AppError, UnknownError } from './utils/error'
const authModel = new AuthModel()

export function startSocketIo(httpServer: Server) {
  const server = new SocketIoServer(httpServer, {
    cors: {
      origin: '*'
    }
  })
  server.on('connection', socket => {
    const { sessionId, token } = socket.handshake.auth
    authModel
      .authenticate(sessionId, token)
      .then(() => {
        socket.on('download', musicId => {
          const download = new Downloader(musicId)
          download.on('error', error => socket.emit('error', error))
          download.on('progress', progress => socket.emit('progress', progress))
          download.on('success', success => socket.emit('success', success))
          download.start()
        })
      })
      .catch(error => {
        if (error instanceof AppError) {
          socket.emit('error', error.toJson())
        } else {
          console.error(error)
          const unknownError = new UnknownError()
          socket.emit('error', unknownError.toJson())
        }
      })
  })
}
