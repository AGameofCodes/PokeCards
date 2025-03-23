import type UserInfo from '../../../../models/api/v1/user/UserInfo';
import type UserSessionInfo from '../../../../models/api/v1/user/UserSessionInfo';
import {mergeDeep} from '../../../../util/merge';
import BaseModel from '../../../../models/db/BaseModel';
import type {JSONSchema} from 'objection';

export class VerifyResponse extends BaseModel {
  success!: boolean;
  user?: UserInfo;
  session?: UserSessionInfo;
  message?: string;

  static NOT_AUTHENTICATED = VerifyResponse.failed('Not authenticated!');//TODO placeholder message

  static success(user: UserInfo, session: UserSessionInfo): VerifyResponse {
    const ret = new VerifyResponse();
    ret.success = true;
    ret.user = user;
    ret.session = session;
    return ret;
  }

  static failed(message: string): VerifyResponse {
    const ret = new VerifyResponse();
    ret.success = false;
    ret.message = message;
    return ret;
  }

  static override get jsonSchemaWithReferences(): JSONSchema {
    return mergeDeep({}, super.jsonSchemaWithReferences, {
      $id: 'VerifyResponse',
      type: 'object',
      required: ['success'],

      properties: {
        success: {type: 'boolean'},
        user: {'$ref': '#/definitions/UserInfo'},
        session: {'$ref': '#/definitions/UserSessionInfo'},
        message: {type: 'string'},
      },
    });
  }
}