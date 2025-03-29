import {mergeDeep} from '../../util/merge';
import type {JSONSchema} from 'objection';
import {UUID} from 'node:crypto';
import BaseModelId from './BaseModelId';

export default class UserCardLabel extends BaseModelId {
  labelId!: UUID;
  userCardId!: UUID;
  value!: string | null | undefined; // maxLength 255

  static new(id: UUID, labelId: UUID, userCardId: UUID, value: string): UserCardLabel {
    const ret = new UserCardLabel();
    ret.id = id;
    ret.labelId = labelId;
    ret.userCardId = userCardId;
    ret.value = value;
    return ret;
  }

  static override get tableName(): string {
    return 'usercardLabels';
  }

  static override get jsonSchemaWithReferences(): JSONSchema {
    return mergeDeep({}, super.jsonSchemaWithReferences, {
      $id: 'UserCardLabel',
      required: ['labelId', 'userCardId'],

      properties: {
        labelId: {type: 'string', format: 'uuid'},
        userCardId: {type: 'string', format: 'uuid'},
        value: {type: 'string', nullable: true, maxLength: 255},
      },
    });
  }
}