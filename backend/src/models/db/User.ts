import BaseModelCreatedUpdated from '../../models/db/BaseModelCreatedUpdated';
import {mergeDeep} from '../../util/merge';
import type {JSONSchema} from 'objection';
import type UserInfo from '../../models/api/v1/user/UserInfo';
import {UUID} from 'node:crypto';

export default class User extends BaseModelCreatedUpdated {
  static SYSTEM_USER_NAME = "__system__";
  static ANONYMOUS_USER_NAME = "__anonymous__";

  name!: string; //max length 32
  password: string | undefined; //max length 255
  email: string | undefined; //max length 255
  displayName!: string; //max length 255

  static new(id: UUID, name: string, displayName: string, password: string, createdBy: UUID): User {
    const ret = new User();
    ret.id = id;
    ret.name = name;
    ret.displayName = displayName;
    ret.password = password;
    ret.createdBy = createdBy;
    ret.updatedBy = createdBy;
    return ret;
  }

  static fromUserInfo(userInfo: UserInfo) {
    const ret = new User();
    ret.id = userInfo.id;
    ret.name = userInfo.name;
    ret.password = undefined;
    ret.createdBy = userInfo.createdBy;
    ret.updatedBy = userInfo.updatedBy;
    return ret;
  }

  static override get tableName(): string {
    return 'users';
  }

  static override get jsonSchemaWithReferences(): JSONSchema {
    return mergeDeep({}, super.jsonSchemaWithReferences, {
      $id: 'User',
      required: ['name', 'displayName'],

      properties: {
        name: {type: 'string', minLength: 1, maxLength: 32, pattern: '[^\\s]+'}, //max length 32 //TODO reference this in login/register request
        password: {type: 'string', nullable: true, maxLength: 255}, //maxlength 255
        email: {type: 'string', format: 'email', nullable: true, maxLength: 255}, //maxlength 255
        displayName: {type: 'string', maxLength: 255}, //maxlength 255
      },
    });
  }
}