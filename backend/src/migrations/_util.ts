import type {Knex} from 'knex';

export function createdAndUpdatedFields(table: Knex.CreateTableBuilder): void {
  table.datetime('createdAt', {useTz: false}).notNullable();
  table.uuid('createdBy').notNullable().references('id').inTable('users').onUpdate('RESTRICT').onDelete('RESTRICT');
  table.datetime('updatedAt', {useTz: false}).notNullable();
  table.uuid('updatedBy').notNullable().references('id').inTable('users').onUpdate('RESTRICT').onDelete('RESTRICT');
}