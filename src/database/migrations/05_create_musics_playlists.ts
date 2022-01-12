import { Knex } from 'knex'

const tableName = 'musics_playlists'

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, table => {
    table.integer('position').notNullable()

    table
      .string('playlistId')
      .notNullable()
      .references('id')
      .inTable('playlists')
      .onDelete('cascade')
      .onUpdate('cascade')
    table
      .string('musicId')
      .notNullable()
      .references('id')
      .inTable('musics')
      .onDelete('cascade')
      .onUpdate('cascade')

    table.string('youtubeId').notNullable()
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName)
}
