import knex, {type Knex} from 'knex';
import {Model} from 'objection';
import type {ConfigType} from './config/confighelper';
import {type Migration, Migrations} from './migrations/_migrations';

export async function initDb(config: ConfigType, enableForeignKeys: boolean): Promise<Knex> {
  const dbConf = (config.database as any)[config.database.use];
  if (!dbConf) {
    throw new Error('No database config found with name "' + config.database.use + '"!');
  }

  if (dbConf.client === 'sqlite3') {
    if (!dbConf.pool) {
      dbConf.pool = {};
    }

    if (enableForeignKeys) {
      dbConf.pool.afterCreate = (conn: any, cb: any) => {
        conn.run('PRAGMA foreign_keys = ON', cb);
      };
    }
  }

  const knx = knex(dbConf);
  Model.knex(knx);
  return knx;
}

export async function migrateDb(knex: Knex): Promise<boolean> {
  try {
    await knex.migrate.latest({
      migrationSource: new ViteMigrationSource(Migrations),
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

class ViteMigrationSource implements Knex.MigrationSource<Migration> {
  private readonly migrations: Migration[];

  constructor(migrations: Migration[]) {
    this.migrations = migrations;
  }

  getMigrations(loadExtensions: string[]): Promise<Migration[]> {
    return Promise.resolve(this.migrations);
  }

  getMigrationName(migration: Migration): string {
    return migration.name;
  }

  getMigration(migration: Migration): Promise<Knex.Migration> {
    return Promise.resolve(migration.migration);
  }
}
