import 'dotenv/config'
import { errors } from 'celebrate'
import cors from 'cors'
import express from 'express'
import { createServer } from 'http'

import { routes } from './routes'
import { startSocketIo } from './socket'

const app = express()

const server = createServer(app)

app.use(cors())
app.use(express.json())
app.use(routes)
app.use(errors())
const port = process.env.PORT || 3000
startSocketIo(server)
server.listen(port, () => {
  console.log('Servidor rodando na porta:', port)
})
