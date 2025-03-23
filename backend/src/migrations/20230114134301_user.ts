import type {Knex} from 'knex';
import {createdAndUpdatedFields} from './_util';

export async function up(knex: Knex): Promise<void> {
  console.log('Running migration 20230114134301_user');

  await knex.transaction(async trx => {
    await knex.schema.createTable('users', table => {
      table.uuid('id').primary();
      table.string('name', 32).notNullable().unique();
      table.string('password', 255).notNullable();
      createdAndUpdatedFields(table);
    }).transacting(trx);
    await knex.schema.createTable('usersessions', table => {
      table.uuid('id').primary();
      table.uuid('userId').notNullable().references('id').inTable('users').onUpdate('RESTRICT').onDelete('RESTRICT');
      table.dateTime('expires', {useTz: false}).notNullable();
      table.json('data');
    }).transacting(trx);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.transaction(async trx => {
    await knex.schema.dropTable('usersessions').transacting(trx);
    await knex.schema.dropTable('users').transacting(trx);
  });
}

