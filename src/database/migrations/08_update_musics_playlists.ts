import { Knex } from 'knex'

const tableName = 'musics_playlists'

export async function up(knex: Knex) {
  return knex.schema.alterTable(tableName, table => {
    table.setNullable('youtubeId')
    table.renameColumn('youtubeId', 'youtubePlaylistItemId')
    table.boolean('ytSync').notNullable().defaultTo(false)
    table.boolean('spotifySync').notNullable().defaultTo(false)
  })
}

export async function down(knex: Knex) {
  return knex.schema.alterTable(tableName, table => {
    table.renameColumn('youtubePlaylistItemId', 'youtubeId')
    table.dropNullable('youtubeId')
    table.dropColumn('ytSync')
    table.dropColumn('spotifySync')
  })
}
