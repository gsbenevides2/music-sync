import knex from 'knex'

export const db = knex({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'music-sync'
  }
})
