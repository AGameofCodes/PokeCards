import {describe, expect, test} from '@jest/globals';
import UserSession from '../UserSession';
import UserInfo from '../../api/v1/user/UserInfo';
import {randomUUID} from 'crypto';
import {initGlobals} from '../../../util/GlobalInit';

describe('UserSession model', () => {
  test('fromJSON/toJSON works', () => {
    initGlobals(); //required for validator

    const session = new UserSession();
    session.id = randomUUID();
    session.userId = randomUUID();
    session.expires = new Date();
    session.data = {
      cookie: {originalMaxAge: 10000},
      authed: true,
      authMethod: 'default',
      userId: randomUUID(),
      user: new UserInfo(),
    } as any;
    const res = UserSession.fromJson(session.toJSON());
    expect(res).toStrictEqual(session);
  });

  test('jsonSchema', () => {
    const res = UserSession.jsonSchema;
    expect(res).toStrictEqual({
      $id: 'UserSession',
      type: 'object',
      required: ['id', 'userId', 'expires', 'data'],

      properties: {
        id: {type: 'string', format: 'uuid'},
        userId: {type: 'string', format: 'uuid', nullable: true},
        expires: {type: 'string', format: 'date-time'},
        data: {type: 'object', nullable: true},
      },

      definitions: {},
    });
  });
});
