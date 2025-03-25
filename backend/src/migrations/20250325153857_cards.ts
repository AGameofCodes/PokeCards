import type {Knex} from 'knex';


export async function up(knex: Knex): Promise<void> {
  console.log('Running migration 20250325153857_cards');

  await knex.transaction(async trx => {
    await knex.schema.createTable('cards', table => {
      table.uuid('uid').primary();
      table.string('id', 255).notNullable();
      table.string('name', 255).notNullable();
      table.string('setId', 255).notNullable();
      table.string('number', 255).notNullable();
      table.string('image', 255).notNullable();
      table.string('language', 15).notNullable();
      table.datetime('updatedAt', {useTz: false}).notNullable();
      table.unique(['id', 'language'], {indexName: 'U_cards_id_language'});
    }).transacting(trx);
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.transaction(async trx => {
    await knex.schema.dropTable('cards').transacting(trx);
  });
}

