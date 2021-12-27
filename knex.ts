import 'dotenv/config'
import { Knex } from 'knex'
import path from 'path'

const config: Knex.Config<any> = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: path.resolve(__dirname, 'src', 'database', 'migrations')
  }
}

export default config
