import type {Knex} from 'knex';
import {createdAndUpdatedFields} from './_util';


export async function up(knex: Knex): Promise<void> {
  console.log('Running migration 20250325193334_usercards');

  await knex.transaction(async trx => {
    await knex.schema.createTable('usercards', table => {
      table.uuid('id').primary();
      table.uuid('cardUid').notNullable().references('uid').inTable('cards').onUpdate('RESTRICT').onDelete('RESTRICT');
      createdAndUpdatedFields(table);
    }).transacting(trx);
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.transaction(async trx => {
    await knex.schema.dropTable('usercards').transacting(trx);
  });
}

