import BaseModel from '../../../../models/db/BaseModel';
import type UserInfo from '../../../../models/api/v1/user/UserInfo';
import type UserSessionInfo from '../../../../models/api/v1/user/UserSessionInfo';
import {mergeDeep} from '../../../../util/merge';
import type {JSONSchema} from 'objection';

export class LoginRequest extends BaseModel {
  username!: string;//max length 32
  password!: string;//max length 255

  static override get tableName(): string {
    return '';//dummy so that the adj validator doe not complain, TODO don't inherit form objection.Model but use another json validation
  }

  static override get jsonSchemaWithReferences(): JSONSchema {
    return mergeDeep({}, super.jsonSchemaWithReferences, {
      $id: 'LoginRequest',
      type: 'object',
      required: ['username', 'password'],

      properties: {
        username: {type: 'string', maxLength: 32},
        password: {type: 'string'},
      },
    });
  }
}

export class LoginResponse extends BaseModel {
  success!: boolean;
  user?: UserInfo;
  session?: UserSessionInfo;
  message?: string;

  static USERNAME_OR_PASSWORD_WRONG = LoginResponse.failed('Username or password wrong!');//TODO placeholder message

  static success(user: UserInfo, session: UserSessionInfo): LoginResponse {
    const ret = new LoginResponse();
    ret.success = true;
    ret.user = user;
    ret.session = session;
    return ret;
  }

  static failed(message: string): LoginResponse {
    const ret = new LoginResponse();
    ret.success = false;
    ret.message = message;
    return ret;
  }

  static override get jsonSchemaWithReferences(): JSONSchema {
    return mergeDeep({}, super.jsonSchemaWithReferences, {
      $id: 'LoginResponse',
      type: 'object',
      required: ['success'],

      properties: {
        success: {type: 'boolean'},
        user: {$ref: '#/definitions/UserInfo'},
        session: {$ref: '#/definitions/UserSessionInfo'},
        message: {type: 'string'},
      },
    });
  }
}