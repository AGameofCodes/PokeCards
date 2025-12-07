import {describe, expect, test} from '@jest/globals';
import {initGlobals} from '../../../util/GlobalInit';
import Card from '../Card';
import {randomString} from '../../../util/string';
import {randomUUID} from 'crypto';
import {randomBoolean, randomNumber} from '../../../rand';

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
    card.pricing = {
      cardmarket: {
        updatedAt: new Date().toISOString(),
        unit: randomString(3),
        avg: randomNumber(1000),
        low: randomNumber(1000),
        trend: randomNumber(1000),
        avg1: randomNumber(1000),
        avg7: randomNumber(1000),
        avg30: randomNumber(1000),
        'avg-holo': randomNumber(1000),
        'low-holo': randomNumber(1000),
        'trend-holo': randomNumber(1000),
        'avg1-holo': randomNumber(1000),
        'avg7-holo': randomNumber(1000),
        'avg30-holo': randomNumber(1000),
      },
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
      required: ['uid', 'id', 'name', 'setId', 'number', 'image', 'variants', 'pricing', 'language', 'updatedAt'],

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
        pricing: {
          type: 'object',
          properties: {
            cardmarket: {
              type: 'object',
              properties: {
                updatedAt: {type: 'string', format: 'date-time'},
                unit: {type: 'string'},
                avg: {type: 'number'},
                low: {type: 'number'},
                trend: {type: 'number'},
                avg1: {type: 'number'},
                avg7: {type: 'number'},
                avg30: {type: 'number'},
                'avg-holo': {type: 'number'},
                'low-holo': {type: 'number'},
                'trend-holo': {type: 'number'},
                'avg1-holo': {type: 'number'},
                'avg7-holo': {type: 'number'},
                'avg30-holo': {type: 'number'},
              },
            },
          },
        },
        language: {type: 'string', minLength: 2, maxLength: 15}, //max length 255
        updatedAt: {type: 'string', format: 'date-time'},
      },

      definitions: {},
    });
  });
});
