import type {Knex} from 'knex';
import * as M20230114134301_user from './20230114134301_user';
import * as M20230610151046_userEmailAndDisplayName from './20230610151046_userEmailAndDisplayName';

export type Migration = {
  name: string,
  migration: { up: (knex: Knex) => Promise<void>, down: (knex: Knex) => Promise<void> }
};

export const Migrations: Migration[] = [
  {name: '20230114134301_user', migration: M20230114134301_user},
  {name: '20230610151046_userEmailAndDisplayName', migration: M20230610151046_userEmailAndDisplayName},
];
//TODO use glob import