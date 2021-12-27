import { Knex } from 'knex'

export const tableName = 'sessions'

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, table => {
    table.string('id').primary()
    table.string('token').notNullable()
    table
      .dateTime('createdAt')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName)
}
