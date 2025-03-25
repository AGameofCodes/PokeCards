import type {Knex} from 'knex';
import * as M20230114134301_user from './20230114134301_user';
import * as M20230610151046_userEmailAndDisplayName from './20230610151046_userEmailAndDisplayName';
import * as M20250325153857_cards from './20250325153857_cards';
import * as M20250325193334_usercards from './20250325193334_usercards';

export type Migration = {
  name: string,
  migration: { up: (knex: Knex) => Promise<void>, down: (knex: Knex) => Promise<void> }
};

export const Migrations: Migration[] = [
  {name: '20230114134301_user', migration: M20230114134301_user},
  {name: '20230610151046_userEmailAndDisplayName', migration: M20230610151046_userEmailAndDisplayName},
  {name: '20250325153857_cards', migration: M20250325153857_cards},
  {name: '20250325193334_usercards', migration: M20250325193334_usercards},
];
//TODO use glob import