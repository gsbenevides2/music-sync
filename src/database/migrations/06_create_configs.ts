import { Knex } from 'knex'

const tableName = 'configs'

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, table => {
    table.string('name').unique().notNullable()
    table.string('value1')
    table.string('value2')
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName)
}
