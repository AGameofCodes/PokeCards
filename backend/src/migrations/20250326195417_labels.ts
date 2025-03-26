import type {Knex} from 'knex';
import {createdAndUpdatedFields} from './_util';


export async function up(knex: Knex): Promise<void> {
  console.log('Running migration 20250326195417_labels');

  await knex.transaction(async trx => {
    await knex.schema.createTable('labels', table => {
      table.uuid('id').primary();
      table.string('name', 255).notNullable();
      table.string('type', 32).notNullable();
      table.string('enumValues', 1024).nullable();
      table.string('color', 32).notNullable();
      createdAndUpdatedFields(table);
      table.unique(['name', 'createdBy'], {indexName: 'U_labels_name_createdBy'});
    }).transacting(trx);
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.transaction(async trx => {
    await knex.schema.dropTable('labels').transacting(trx);
  });
}

