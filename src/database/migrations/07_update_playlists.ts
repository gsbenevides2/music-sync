import { Knex } from 'knex'

const tableName = 'playlists'

export async function up(knex: Knex) {
  return knex.schema.alterTable(tableName, table => {
    table.setNullable('youtubeId')
    table.setNullable('spotifyId')
  })
}

export async function down(knex: Knex) {
  return knex.schema.alterTable(tableName, table => {
    table.dropNullable('youtubeId')
    table.dropNullable('spotifyId')
  })
}
