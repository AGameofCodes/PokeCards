import {describe, expect, test} from '@jest/globals';
import {initGlobals} from '../../../util/GlobalInit';
import {randomUUID} from 'crypto';
import UserCardLabel from '../UserCardLabel';
import {randomString} from '../../../util/string';

describe('UserCard model', () => {
  test('fromJSON/toJSON works', () => {
    initGlobals(); //required for validator

    const userCard = new UserCardLabel();
    userCard.id = randomUUID();
    userCard.labelId = randomUUID();
    userCard.userCardId = randomUUID();
    userCard.value = randomString(20);
    const res = UserCardLabel.fromJson(userCard.toJSON());
    expect(res).toStrictEqual(userCard);
  });

  test('jsonSchema', () => {
    const res = UserCardLabel.jsonSchema;
    expect(res).toStrictEqual({
      $id: 'UserCardLabel',
      type: 'object',
      required: ['id', 'labelId', 'userCardId'],

      properties: {
        id: {type: 'string', format: 'uuid'},
        labelId: {type: 'string', format: 'uuid'},
        userCardId: {type: 'string', format: 'uuid'},
        value: {type: 'string', nullable: true, maxLength: 255},
      },

      definitions: {},
    });
  });
});
