import {describe, expect, test} from '@jest/globals';
import {initGlobals} from '../../../util/GlobalInit';
import Card from '../Card';
import {randomUUID} from 'crypto';
import {randomString} from '../../../util/string';

describe('Label model', () => {
  test('fromJSON/toJSON works', () => {
    initGlobals(); //required for validator

    const label = new Card();
    label.id = randomUUID();
    label.createdAt = new Date();
    label.createdBy = randomUUID();
    label.updatedAt = new Date();
    label.updatedBy = randomUUID();
    label.name = randomString(20);
    label.description = randomString(700);
    label.unit = randomString(7);
    label.color = randomString(7);
    label.minReference = Math.random();
    label.maxReference = Math.random();
    const res = Card.fromJson(label.toJSON());
    expect(res).toStrictEqual(label);
  });

  test('jsonSchema', () => {
    const res = Card.jsonSchema;
    expect(res).toStrictEqual({
      $id: 'Label',
      type: 'object',
      required: ['id', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy', 'name', 'description', 'unit', 'color', 'minReference', 'maxReference'],

      properties: {
        id: {type: 'string', format: 'uuid'},
        createdAt: {type: 'string', format: 'date-time'},
        createdBy: {type: 'string', format: 'uuid'},
        updatedAt: {type: 'string', format: 'date-time'},
        updatedBy: {type: 'string', format: 'uuid'},
        name: {type: 'string', minLength: 1, maxLength: 255},
        description: {type: 'string', maxLength: 32767},
        unit: {type: 'string', maxLength: 32},
        color: {type: 'string', maxLength: 32},
        minReference: {type: 'number'},
        maxReference: {type: 'number'},
      },

      definitions: {},
    });
  });
});
