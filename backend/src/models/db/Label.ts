import BaseModelCreatedUpdated from '../../models/db/BaseModelCreatedUpdated';
import {mergeDeep} from '../../util/merge';
import type {JSONSchema} from 'objection';
import {UUID} from 'node:crypto';

export type LabelType = 'enum' | 'boolean';

export default class Label extends BaseModelCreatedUpdated {
  name!: string; //min 1, max length 255, unique with createdBy
  type!: LabelType; //max length 32
  enumValues!: string | null | undefined; //max length 1024
  color!: string; //max length 32

  static new(id: UUID, name: string, type: LabelType, enumValues: string, color: string, createdBy: UUID): Label {
    const ret = new Label();
    ret.id = id;
    ret.name = name;
    ret.type = type;
    ret.enumValues = enumValues;
    ret.color = color;
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
      required: ['name', 'type', 'enumValues', 'color'],

      properties: {
        name: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        type: {type: 'string', maxLength: 32}, //max length 32
        enumValues: {type: 'string', maxLength: 1024}, //max length 32
        color: {type: 'string', maxLength: 32}, //max length 32
      },
    });
  }
}