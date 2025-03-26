import {describe, expect, test} from '@jest/globals';
import {initGlobals} from '../../../util/GlobalInit';
import Label, {LabelType} from '../Label';
import {randomUUID} from 'crypto';
import {randomString} from '../../../util/string';
import {randomInt} from 'node:crypto';

describe('Label model', () => {
  test('fromJSON/toJSON works', () => {
    initGlobals(); //required for validator

    const label = new Label();
    label.id = randomUUID();
    label.createdAt = new Date();
    label.createdBy = randomUUID();
    label.updatedAt = new Date();
    label.updatedBy = randomUUID();
    label.name = randomString(20);
    label.type = ['enum', 'boolean'][randomInt(1)] as LabelType;
    label.enumValues = randomString(700);
    label.color = randomString(7);
    const res = Label.fromJson(label.toJSON());
    expect(res).toStrictEqual(label);
  });

  test('jsonSchema', () => {
    const res = Label.jsonSchema;
    expect(res).toStrictEqual({
      $id: 'Label',
      type: 'object',
      required: ['id', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy', 'name', 'type', 'enumValues', 'color'],

      properties: {
        id: {type: 'string', format: 'uuid'},
        createdAt: {type: 'string', format: 'date-time'},
        createdBy: {type: 'string', format: 'uuid'},
        updatedAt: {type: 'string', format: 'date-time'},
        updatedBy: {type: 'string', format: 'uuid'},
        name: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        type: {type: 'string', maxLength: 32}, //max length 32
        enumValues: {type: 'string', maxLength: 1024}, //max length 32
        color: {type: 'string', maxLength: 32}, //max length 32
      },

      definitions: {},
    });
  });
});
