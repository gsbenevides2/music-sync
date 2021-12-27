import 'dotenv/config'
import { Knex } from 'knex'
import path from 'path'

const { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT } = process.env

const config: Knex.Config<any> = {
  client: 'mysql',
  connection: {
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: 'music-sync'
  },
  migrations: {
    directory: path.resolve(__dirname, 'src', 'database', 'migrations')
  }
}

export default config
