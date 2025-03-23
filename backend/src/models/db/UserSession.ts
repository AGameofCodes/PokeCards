import type {SessionData} from 'express-session';
import type {JSONSchema, ModelOptions, Pojo, StaticHookArguments} from 'objection';
import BaseModelId from '../../models/db/BaseModelId';
import {mergeDeep} from '../../util/merge';
import {UUID} from 'node:crypto';

export default class UserSession extends BaseModelId {
  userId!: UUID | undefined;
  expires!: Date;
  data!: SessionData | undefined;//json

  static new(id: UUID, userId?: UUID): UserSession {
    const ret = new UserSession();
    ret.id = id;
    ret.userId = userId;
    ret.expires = new Date();
    ret.data = undefined;
    return ret;
  }

  static override get tableName(): string {
    return 'usersessions';
  }

  static override get jsonAttributes(): string[] {
    return ['data'];
  }

  static override get jsonSchemaWithReferences(): JSONSchema {
    return mergeDeep({}, super.jsonSchemaWithReferences, {
      $id: 'UserSession',
      type: 'object',
      required: ['userId', 'expires', 'data'],

      properties: {
        userId: {type: 'string', format: 'uuid', nullable: true},//uuid
        expires: {type: 'string', format: 'date-time'},
        data: {type: 'object', nullable: true},
      },
    });
  }

  static override afterFind(args: StaticHookArguments<UserSession>): void {
    args.result.forEach((session: UserSession) => {
      session.expires = session.expires && new Date(session.expires);
    });
  }

  override $beforeValidate(jsonSchema: JSONSchema, json: Pojo, opt: ModelOptions): JSONSchema {
    if (['number', 'object'].includes(typeof json.expires)) {
      json.expires = json.expires && new Date(json.expires).toISOString() as any;
    }
    return super.$beforeValidate(jsonSchema, json, opt);
  }

  override $set(obj: Pojo): this {
    super.$set(obj);

    if (['number', 'string'].includes(typeof obj.expires)) {
      this.expires = new Date(obj.expires);
    }
    return this;
  }
}