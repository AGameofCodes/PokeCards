import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  console.log('Running migration 20250329203754_sets');

  await knex.transaction(async trx => {
    await knex.schema.createTable('sets', table => {
      table.uuid('uid').primary();
      table.string('id', 255).notNullable();
      table.string('name', 255).notNullable();
      table.string('serieId', 255).notNullable();
      table.string('logo', 255).notNullable();
      table.string('symbol', 255).notNullable();
      table.date('releaseDate').notNullable();
      table.string('abbreviation', 255).notNullable();
      table.string('language', 15).notNullable();
      table.datetime('updatedAt', {useTz: false}).notNullable();
      table.unique(['id', 'language'], {indexName: 'U_sets_id_language'});
    }).transacting(trx);
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.transaction(async trx => {
    await knex.schema.dropTable('sets').transacting(trx);
  });
}

