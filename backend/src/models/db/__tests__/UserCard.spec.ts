import {describe, expect, test} from '@jest/globals';
import {initGlobals} from '../../../util/GlobalInit';
import UserCard from '../UserCard';
import {randomUUID} from 'crypto';
import {randomString} from '../../../util/string';

describe('UserCard model', () => {
  test('fromJSON/toJSON works', () => {
    initGlobals(); //required for validator

    const userCard = new UserCard();
    userCard.id = randomUUID();
    userCard.cardUid = randomUUID();
    userCard.variant = randomString(10);
    userCard.createdAt = new Date();
    userCard.createdBy = randomUUID();
    userCard.updatedAt = new Date();
    userCard.updatedBy = randomUUID();
    const res = UserCard.fromJson(userCard.toJSON());
    expect(res).toStrictEqual(userCard);
  });

  test('jsonSchema', () => {
    const res = UserCard.jsonSchema;
    expect(res).toStrictEqual({
      $id: 'UserCard',
      type: 'object',
      required: ['id', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy', 'cardUid'],

      properties: {
        id: {type: 'string', format: 'uuid'},
        createdAt: {type: 'string', format: 'date-time'},
        createdBy: {type: 'string', format: 'uuid'}, //User.id
        updatedAt: {type: 'string', format: 'date-time'},
        updatedBy: {type: 'string', format: 'uuid'}, //User.id
        cardUid: {type: 'string', format: 'uuid'},
        variant: {type: 'string', maxLength: 255},
        labels: {type: 'array', items: {$ref: '#/definitions/UserCardLabel'}},
      },

      definitions: {
        UserCardLabel: {
          $id: 'UserCardLabel',
          type: 'object',
          required: ['id', 'labelId', 'userCardId'],

          properties: {
            id: {format: 'uuid', type: 'string'},
            labelId: {format: 'uuid', type: 'string'},
            userCardId: {format: 'uuid', type: 'string'},
            value: {maxLength: 255, nullable: true, type: 'string'},
          },
        },
      },
    });
  });
});
