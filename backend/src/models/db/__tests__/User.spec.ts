import {describe, expect, test} from '@jest/globals';
import User from '../User';
import {randomUUID} from 'crypto';
import {randomString} from '../../../util/string';
import {initGlobals} from '../../../util/GlobalInit';

describe('User model', () => {
  test('fromJSON/toJSON works', () => {
    initGlobals(); //required for validator

    const user = new User();
    user.id = randomUUID();
    user.name = randomString(10);
    user.password = randomString(10);
    user.email = randomString(10) + '@' + randomString(10) + '.' + randomString(2);
    user.displayName = randomString(10);
    user.createdAt = new Date();
    user.createdBy = randomUUID();
    user.updatedAt = new Date();
    user.updatedBy = randomUUID();
    const res = User.fromJson(user.toJSON());
    expect(res).toStrictEqual(user);
  });

  test('jsonSchema', () => {
    const res = User.jsonSchema;
    expect(res).toStrictEqual({
      $id: 'User',
      type: 'object',
      required: ['id', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy', 'name', 'displayName'],

      properties: {
        id: {type: 'string', format: 'uuid'},
        createdAt: {type: 'string', format: 'date-time'},
        createdBy: {type: 'string', format: 'uuid'}, //User.id
        updatedAt: {type: 'string', format: 'date-time'},
        updatedBy: {type: 'string', format: 'uuid'}, //User.id
        name: {type: 'string', minLength: 1, maxLength: 32, pattern: '[^\\s]+'}, //max length 32
        password: {type: 'string', nullable: true, maxLength: 255}, //maxlength 255
        email: {type: 'string', format: 'email', nullable: true, maxLength: 255}, //maxlength 255
        displayName: {type: 'string', maxLength: 255}, //maxlength 255
      },

      definitions: {},
    });
  });
});
