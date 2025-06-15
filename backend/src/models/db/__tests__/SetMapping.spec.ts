import {describe, expect, test} from '@jest/globals';
import {initGlobals} from '../../../util/GlobalInit';
import SetMapping from '../SetMapping';
import {randomString} from '../../../util/string';

describe('SetMapping model', () => {
  test('fromJSON/toJSON works', () => {
    initGlobals(); //required for validator

    const setMapping = new SetMapping();
    setMapping.tcgDexNetId = randomString(20);
    setMapping.pokemonTcgIoId = randomString(20);
    setMapping.updatedAt = new Date();
    const res = SetMapping.fromJson(setMapping.toJSON());
    expect(res).toStrictEqual(setMapping);
  });

  test('jsonSchema', () => {
    const res = SetMapping.jsonSchema;
    expect(res).toStrictEqual({
      $id: 'SetMapping',
      type: 'object',
      required: ['tcgDexNetId', 'pokemonTcgIoId', 'updatedAt'],

      properties: {
        tcgDexNetId: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        pokemonTcgIoId: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        updatedAt: {type: 'string', format: 'date-time'},
      },

      definitions: {},
    });
  });
});
