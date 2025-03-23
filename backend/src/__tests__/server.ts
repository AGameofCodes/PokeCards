import Server from '../server';
import {getTestConfig} from './util';
import {describe, test} from '@jest/globals';

describe('server', () => {
  test('boot server from scratch', async () => {
    const server = new Server();
    await server.init(getTestConfig());
    await server.queueStart();
    await server.queueStop();
  });
});
