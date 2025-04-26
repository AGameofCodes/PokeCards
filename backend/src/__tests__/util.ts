import {mergeDeep} from '../util/merge';
import {randomUUID} from 'crypto';

const dbConfig = {
  use: 'sqlite',
  sqlite: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: ':memory:',
    },
    pool: {
      min: 1,
      max: 1,
      destroyTimeoutMillis: 3600 * 1000,
      idleTimeoutMillis: 3600 * 1000,
    },
  },
};

export function getTestDbConfig(): any {
  const config = mergeDeep({}, dbConfig);
  config.sqlite.connection.filename = 'file:test.' + randomUUID() + '.db?mode=memory&cache=shared';
  config.sqlite.connection.flags = ['OPEN_URI', 'OPEN_SHAREDCACHE'];
  return config;
}

export function getTestConfig(): any {
  return {
    'server': {
      'host': 'localhost',
      'port': 44626,
      'baseUrl': 'http://localhost:44626/',
    },
    'database': getTestDbConfig(),
  };
}