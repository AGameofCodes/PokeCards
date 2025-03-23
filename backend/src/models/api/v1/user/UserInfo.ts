import type User from '../../../../models/db/User';
import BaseModelCreatedUpdated from '../../../../models/db/BaseModelCreatedUpdated';
import {mergeDeep} from '../../../../util/merge';
import type {JSONSchema} from 'objection';

export default class UserInfo extends BaseModelCreatedUpdated {
  name!: string;
  email: string | undefined;
  displayName!: string;

  static fromUser(user: User): UserInfo {
    const ret = new UserInfo();
    ret.id = user.id;
    ret.name = user.name;
    ret.email = user.email;
    ret.displayName = user.displayName;
    ret.createdAt = user.createdAt;
    ret.createdBy = user.createdBy;
    ret.updatedAt = user.updatedAt;
    ret.updatedBy = user.updatedBy;
    return ret;
  }

  static override get jsonSchemaWithReferences(): JSONSchema {
    return mergeDeep({}, super.jsonSchemaWithReferences, {
      $id: 'UserInfo',
      required: ['name', 'displayName'],

      properties: {
        name: {type: 'string', minLength: 1, maxLength: 32}, //max length 32
        email: {type: 'string', format: 'email', nullable: true, maxLength: 255}, //maxlength 255
        displayName: {type: 'string', maxLength: 255}, //maxlength 255
      },
    });
  }
}