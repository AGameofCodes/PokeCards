import {describe, expect, test} from '@jest/globals';
import {initGlobals} from '../../../util/GlobalInit';
import Card from '../Card';
import {randomString} from '../../../util/string';
import {randomUUID} from 'crypto';
import {randomBoolean} from '../../../rand';

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
    card.rarity = randomString(7);
    card.variants = {
      firstEdition: randomBoolean(),
      holo: randomBoolean(),
      normal: randomBoolean(),
      reverse: randomBoolean(),
      wPromo: randomBoolean(),
    };
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
      required: ['uid', 'id', 'name', 'setId', 'number', 'image', 'variants', 'language', 'updatedAt'],

      properties: {
        uid: {type: 'string', format: 'uuid'},
        id: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        name: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        setId: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        number: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        image: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        rarity: {type: 'string', maxLength: 255}, //max length 255
        variants: {
          type: 'object',
          properties: {
            firstEdition: {type: 'boolean'},
            holo: {type: 'boolean'},
            normal: {type: 'boolean'},
            reverse: {type: 'boolean'},
            wPromo: {type: 'boolean'},
          },
        },
        language: {type: 'string', minLength: 2, maxLength: 15}, //max length 255
        updatedAt: {type: 'string', format: 'date-time'},
      },

      definitions: {},
    });
  });
});
