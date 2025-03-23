import BaseModelCreatedUpdated from '../../models/db/BaseModelCreatedUpdated';
import {mergeDeep} from '../../util/merge';
import type {JSONSchema} from 'objection';
import {UUID} from 'node:crypto';

export default class Card extends BaseModelCreatedUpdated {
  name!: string; //min 1, max length 255, unique with createdBy
  description!: string; //max length 32767
  unit!: string; //max length 32
  color!: string; //max length 32
  minReference!: number;
  maxReference!: number;

  static new(id: UUID, name: string, description: string, unit: string, color: string,
             minReference: number, maxReference: number, createdBy: UUID): Card {
    const ret = new Card();
    ret.id = id;
    ret.name = name;
    ret.description = description;
    ret.unit = unit;
    ret.color = color;
    ret.minReference = minReference;
    ret.maxReference = maxReference;
    ret.createdBy = createdBy;
    ret.updatedBy = createdBy;
    return ret;
  }

  static override get tableName(): string {
    return 'labels';
  }

  static override get jsonSchemaWithReferences(): JSONSchema {
    return mergeDeep({}, super.jsonSchemaWithReferences, {
      $id: 'Label',
      required: ['name', 'description', 'unit', 'color', 'minReference', 'maxReference'],

      properties: {
        name: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        description: {type: 'string', maxLength: 32767}, //max length 32767
        unit: {type: 'string', maxLength: 32}, //max length 32
        color: {type: 'string', maxLength: 32}, //max length 32
        minReference: {type: 'number'},
        maxReference: {type: 'number'},
      },
    });
  }
}