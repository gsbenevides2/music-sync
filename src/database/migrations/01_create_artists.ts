import { Knex } from 'knex'

export const tableName = 'artists'

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, table => {
    table.string('id').primary()
    table.string('name').notNullable()
    table.string('spotifyId').notNullable().unique()
    table.string('spotifyCoverUrl').notNullable()
    table.string('spotifyGenre').notNullable()
    table
      .dateTime('createdAt')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName)
}
