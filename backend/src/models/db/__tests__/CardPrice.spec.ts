import {describe, expect, test} from '@jest/globals';
import {initGlobals} from '../../../util/GlobalInit';
import CardPrice from '../CardPrice';
import {randomString} from '../../../util/string';
import {randomInt} from '../../../rand';

describe('CardPrice model', () => {
  test('fromJSON/toJSON works', () => {
    initGlobals(); //required for validator

    const cardPrice = new CardPrice();
    cardPrice.id = randomString(20);
    cardPrice.cardmarket = {
      url: randomString(10),
      updatedAt: randomString(10),
      prices: {
        averageSellPrice: randomInt(10),
        avg1: randomInt(10),
        avg7: randomInt(10),
        avg30: randomInt(10),
        lowPrice: randomInt(10),
        germanProLow: randomInt(10),
        lowPriceExPlus: randomInt(10),
        trendPrice: randomInt(10),
        suggestedPrice: randomInt(10),
        reverseHoloAvg1: randomInt(10),
        reverseHoloLow: randomInt(10),
        reverseHoloTrend: randomInt(10),
        reverseHoloSell: randomInt(10),
        reverseHoloAvg30: randomInt(10),
        reverseHoloAvg7: randomInt(10),
      },
    };
    cardPrice.updatedAt = new Date();
    const res = CardPrice.fromJson(cardPrice.toJSON());
    expect(res).toStrictEqual(cardPrice);
  });

  test('jsonSchema', () => {
    const res = CardPrice.jsonSchema;
    expect(res).toStrictEqual({
      $id: 'CardPrice',
      type: 'object',
      required: ['id', 'cardmarket', 'updatedAt'],

      properties: {
        id: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        cardmarket: {
          type: 'object',
          required: ['url', 'updatedAt', 'prices'],
          properties: {
            url: {type: 'string', minLength: 1, maxLength: 255},
            updatedAt: {type: 'string', minLength: 1, maxLength: 32},
            prices: {
              type: 'object',
              properties: {
                averageSellPrice: {type: 'number'},
                lowPrice: {type: 'number'},
                trendPrice: {type: 'number'},
                germanProLow: {type: 'number'},
                suggestedPrice: {type: 'number'},
                reverseHoloSell: {type: 'number'},
                reverseHoloLow: {type: 'number'},
                reverseHoloTrend: {type: 'number'},
                lowPriceExPlus: {type: 'number'},
                avg1: {type: 'number'},
                avg7: {type: 'number'},
                avg30: {type: 'number'},
                reverseHoloAvg1: {type: 'number'},
                reverseHoloAvg7: {type: 'number'},
                reverseHoloAvg30: {type: 'number'},
              },
            },
          },
        },
        updatedAt: {type: 'string', format: 'date-time'},
      },

      definitions: {},
    });
  });
});
