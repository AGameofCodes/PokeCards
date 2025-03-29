import {describe, expect, test} from '@jest/globals';
import {initGlobals} from '../../../util/GlobalInit';
import Set from '../Set';
import {randomString} from '../../../util/string';
import {randomUUID} from 'crypto';

describe('Set model', () => {
  test('fromJSON/toJSON works', () => {
    initGlobals(); //required for validator

    const set = new Set();
    set.uid = randomUUID();
    set.id = randomString(20);
    set.name = randomString(20);
    set.serieId = randomString(7);
    set.logo = randomString(7);
    set.symbol = randomString(7);
    set.releaseDate = new Date().toISOString().substring(0, 10);
    set.abbreviation = randomString(7);
    set.language = randomString(7);
    set.updatedAt = new Date();
    const res = Set.fromJson(set.toJSON());
    expect(res).toStrictEqual(set);
  });

  test('jsonSchema', () => {
    const res = Set.jsonSchema;
    expect(res).toStrictEqual({
      $id: 'Set',
      type: 'object',
      required: ['uid', 'id', 'name', 'serieId', 'logo', 'symbol', 'releaseDate', 'abbreviation', 'language', 'updatedAt'],

      properties: {
        uid: {type: 'string', format: 'uuid'},
        id: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        name: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        serieId: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        logo: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        symbol: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        releaseDate: {type: 'string', format: 'date'},
        abbreviation: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        language: {type: 'string', minLength: 2, maxLength: 15}, //max length 255
        updatedAt: {type: 'string', format: 'date-time'},
      },

      definitions: {},
    });
  });
});
