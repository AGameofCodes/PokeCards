import BaseModel from './BaseModel';
import type {JSONSchema} from 'objection';
import {mergeDeep} from '../../util/merge';
import {UUID} from 'node:crypto';

export default abstract class BaseModelId extends BaseModel {
  id!: UUID;

  static override get jsonSchemaWithReferences(): JSONSchema {
    return mergeDeep({}, super.jsonSchemaWithReferences, {
      $id: 'BaseModelId',
      type: 'object',
      required: ['id'],

      properties: {
        id: {type: 'string', format: 'uuid'}, //uuid
      },
    });
  }
}