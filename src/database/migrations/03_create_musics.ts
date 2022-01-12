import { Knex } from 'knex'

const tableName = 'musics'

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, table => {
    table.string('id').primary()
    table.string('name').notNullable()
    table
      .string('artistId', 255)
      .notNullable()
      .references('id')
      .inTable('artists')
      .onDelete('cascade')
      .onUpdate('cascade')
    table
      .string('albumId', 255)
      .notNullable()
      .references('id')
      .inTable('albums')
      .onDelete('cascade')
      .onUpdate('cascade')
    table.string('youtubeId').unique().notNullable()
    table.string('spotifyId').unique().notNullable()

    table.string('trackNumber').notNullable()
    table.string('discNumber').notNullable()
    table.string('lyrics')
    table
      .dateTime('createdAt')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName)
}
