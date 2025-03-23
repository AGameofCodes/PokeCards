import {describe, expect, test} from '@jest/globals';
import BaseModelCreatedUpdated from '../BaseModelCreatedUpdated';

describe('BaseModelCreatedUpdated model', () => {
  // test('fromJSON/toJSON works', () => {
  //   initGlobals(); //required for validator
  //
  //   const baseModel = new BaseModelCreatedUpdated();
  //   baseModel.id = randomUUID();
  //   baseModel.createdAt = new Date();
  //   baseModel.createdBy = randomUUID();
  //   baseModel.updatedAt = new Date();
  //   baseModel.updatedBy = randomUUID();
  //   const res = BaseModelCreatedUpdated.fromJson(baseModel.toJSON());
  //   expect(res).toStrictEqual(baseModel);
  // });

  test('jsonSchema', () => {
    const res = BaseModelCreatedUpdated.jsonSchema;
    expect(res).toStrictEqual({
      $id: 'BaseModelCreatedUpdated',
      type: 'object',
      required: ['id', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy'],

      properties: {
        id: {type: 'string', format: 'uuid'},
        createdAt: {type: 'string', format: 'date-time'},
        createdBy: {type: 'string', format: 'uuid'},
        updatedAt: {type: 'string', format: 'date-time'},
        updatedBy: {type: 'string', format: 'uuid'},
      },

      definitions: {},
    });
  });
});
