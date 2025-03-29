import type {Knex} from 'knex';


export async function up(knex: Knex): Promise<void> {
  console.log('Running migration 20250326201010_usercardLabels');

  await knex.transaction(async trx => {
    await knex.schema.createTable('usercardLabels', table => {
      table.uuid('id').primary();
      table.uuid('labelId').notNullable().references('id').inTable('labels').onUpdate('RESTRICT').onDelete('CASCADE');
      table.uuid('userCardId').notNullable().references('id').inTable('usercards').onUpdate('RESTRICT').onDelete('CASCADE');
      table.string('value', 255);
      table.unique(['labelId', 'userCardId'], {indexName: 'U_usercardLabels_labelId_userCardId'});
    }).transacting(trx);
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.transaction(async trx => {
    await knex.schema.dropTable('usercardLabels').transacting(trx);
  });
}

