import type {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('Running migration 20230610151046_userEmailAndDisplayName');

  await knex.transaction(async trx => {
    await knex.schema.alterTable('users', table => {
      table.string('email', 255).nullable().unique().after('name');
      table.string('displayName', 255).after('email');
    }).transacting(trx);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.transaction(async trx => {
    await knex.schema.alterTable('users', table => {
      table.dropColumn('displayName');
      table.dropColumn('email');
    }).transacting(trx);
  });
}

