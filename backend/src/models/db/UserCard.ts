import BaseModelCreatedUpdated from '../../models/db/BaseModelCreatedUpdated';
import {mergeDeep} from '../../util/merge';
import type {JSONSchema} from 'objection';
import {UUID} from 'node:crypto';

export default class UserCard extends BaseModelCreatedUpdated {
  cardUid!: UUID;

  static new(id: UUID, cardUid: UUID, createdBy: UUID): UserCard {
    const ret = new UserCard();
    ret.id = id;
    ret.cardUid = cardUid;
    ret.createdBy = createdBy;
    ret.updatedBy = createdBy;
    return ret;
  }

  static override get tableName(): string {
    return 'usercards';
  }

  static override get jsonSchemaWithReferences(): JSONSchema {
    return mergeDeep({}, super.jsonSchemaWithReferences, {
      $id: 'UserCard',
      required: ['cardUid'],

      properties: {
        cardUid: {type: 'string', format: 'uuid'},
      },
    });
  }
}