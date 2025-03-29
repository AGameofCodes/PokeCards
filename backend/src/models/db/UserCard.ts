import BaseModelCreatedUpdated from '../../models/db/BaseModelCreatedUpdated';
import {mergeDeep} from '../../util/merge';
import {JSONSchema, Model, RelationMappings, RelationMappingsThunk} from 'objection';
import {UUID} from 'node:crypto';
import UserCardLabel from './UserCardLabel';

export default class UserCard extends BaseModelCreatedUpdated {
  cardUid!: UUID;
  variant!: string | null | undefined; // max length 255
  labels!: UserCardLabel[];

  static new(id: UUID, cardUid: UUID, variant: string | null | undefined, labels: UserCardLabel[], createdBy: UUID): UserCard {
    const ret = new UserCard();
    ret.id = id;
    ret.cardUid = cardUid;
    ret.variant = variant;
    ret.labels = labels;
    ret.createdBy = createdBy;
    ret.updatedBy = createdBy;
    return ret;
  }

  static override get tableName(): string {
    return 'usercards';
  }

  static override get relationMappings(): RelationMappings | RelationMappingsThunk {
    return {
      labels: {
        relation: Model.HasManyRelation,
        modelClass: UserCardLabel,
        join: {
          from: this.tableName + '.id',
          to: UserCardLabel.tableName + '.userCardId',
        },
      },
    };
  }

  static override get jsonSchemaWithReferences(): JSONSchema {
    return mergeDeep({}, super.jsonSchemaWithReferences, {
      $id: 'UserCard',
      required: ['cardUid'],

      properties: {
        cardUid: {type: 'string', format: 'uuid'},
        variant: {type: 'string', maxLength: 255},
        labels: {type: 'array', items: {$ref: '#/definitions/UserCardLabel'}},
      },
    });
  }
}