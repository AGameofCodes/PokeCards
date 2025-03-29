import type {Knex} from 'knex';


export async function up(knex: Knex): Promise<void> {
  console.log('Running migration 20250329115036_variants_rarity');

  await knex.transaction(async trx => {
    await knex.schema.alterTable('cards', table => {
      table.string('rarity', 255).nullable();
      table.json('variants').notNullable().defaultTo({});
    }).transacting(trx);
    await knex.schema.alterTable('usercards', table => {
      table.string('variant', 255).nullable();
    }).transacting(trx);
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.transaction(async trx => {
    await knex.schema.alterTable('usercards', table => {
      table.dropColumn('variant');
    }).transacting(trx);
    await knex.schema.alterTable('cards', table => {
      table.dropColumn('rarity');
      table.dropColumn('variants');
    }).transacting(trx);
  });
}

