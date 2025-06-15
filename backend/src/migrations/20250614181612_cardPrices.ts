import type {Knex} from 'knex';


export async function up(knex: Knex): Promise<void> {
  console.log('Running migration 20250614181612_cardPrices');

  await knex.transaction(async trx => {
    await knex.schema.createTable('cardPrices', table => {
      table.string('id', 255).notNullable().unique();
      table.json('cardmarket').notNullable();
      table.datetime('updatedAt', {useTz: false}).notNullable();
    }).transacting(trx);
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.transaction(async trx => {
    await knex.schema.dropTable('cardPrices').transacting(trx);
  });
}

