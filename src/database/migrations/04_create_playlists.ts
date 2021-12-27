import { Knex } from 'knex'

const tableName = 'playlists'

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, table => {
    table.string('id').primary()
    table.string('name').notNullable()

    table.string('youtubeId').unique().notNullable()
    table.string('spotifyId').unique().notNullable()

    table
      .dateTime('createdAt')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName)
}
