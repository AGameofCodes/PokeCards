import type {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('Running migration 20251207132542_integratedCardPrices');

  await knex.transaction(async trx => {
    await knex.schema.alterTable('cards', table => {
      table.json('pricing').notNullable().defaultTo({cardmarket: {}});
    }).transacting(trx);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.transaction(async trx => {
    await knex.schema.alterTable('cards', table => {
      table.dropColumn('pricing');
    }).transacting(trx);
  });
}
