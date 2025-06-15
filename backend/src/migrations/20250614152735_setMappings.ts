import type {Knex} from 'knex';


export async function up(knex: Knex): Promise<void> {
  console.log('Running migration 20250614152735_setMappings');

  await knex.transaction(async trx => {
    await knex.schema.createTable('setMappings', table => {
      table.string('tcgDexNetId', 255).notNullable();
      table.string('pokemonTcgIoId', 255).notNullable();
      table.datetime('updatedAt', {useTz: false}).notNullable();
      table.unique(['tcgDexNetId', 'pokemonTcgIoId'], {indexName: 'U_setMappings_tcgDexNetId_pokemonTcgIoId'});
    }).transacting(trx);
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.transaction(async trx => {
    await knex.schema.dropTable('setMappings').transacting(trx);
  });
}
