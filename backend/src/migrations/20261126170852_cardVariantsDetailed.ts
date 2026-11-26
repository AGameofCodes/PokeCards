import type {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('Running migration 20261126170852_cardVariantsDetailed');

  await knex.transaction(async trx => {
    await knex.schema.alterTable('cards', table => {
      table.json('variants_detailed').notNullable().defaultTo([]);
    }).transacting(trx);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.transaction(async trx => {
    await knex.schema.alterTable('cards', table => {
      table.dropColumn('variants_detailed');
    }).transacting(trx);
  });
}
