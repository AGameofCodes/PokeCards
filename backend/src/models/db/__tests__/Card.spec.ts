import {describe, expect, test} from '@jest/globals';
import {initGlobals} from '../../../util/GlobalInit';
import Card from '../Card';
import {randomString} from '../../../util/string';
import {randomUUID} from 'crypto';

describe('Card model', () => {
  test('fromJSON/toJSON works', () => {
    initGlobals(); //required for validator

    const card = new Card();
    card.uid = randomUUID();
    card.id = randomString(20);
    card.name = randomString(20);
    card.setId = randomString(7);
    card.number = randomString(7);
    card.image = randomString(7);
    card.language = randomString(7);
    card.updatedAt = new Date();
    const res = Card.fromJson(card.toJSON());
    expect(res).toStrictEqual(card);
  });

  test('jsonSchema', () => {
    const res = Card.jsonSchema;
    expect(res).toStrictEqual({
      $id: 'Card',
      type: 'object',
      required: ['uid', 'id', 'name', 'setId', 'number', 'image', 'language', 'updatedAt'],

      properties: {
        uid: {type: 'string', format: 'uuid'},
        id: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        name: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        setId: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        number: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        image: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        language: {type: 'string', minLength: 2, maxLength: 15}, //max length 255
        updatedAt: {type: 'string', format: 'date-time'},
      },

      definitions: {},
    });
  });
});
