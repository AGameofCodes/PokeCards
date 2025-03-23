import type UserSession from '../../../../models/db/UserSession';
import {mergeDeep} from '../../../../util/merge';
import BaseModelId from '../../../../models/db/BaseModelId';
import type {JSONSchema} from 'objection';

export default class UserSessionInfo extends BaseModelId {
  static fromSession(session: UserSession): UserSessionInfo {
    const ret = new UserSessionInfo();
    ret.id = session.id;
    return ret;
  }

  static override get jsonSchemaWithReferences(): JSONSchema {
    return mergeDeep({}, super.jsonSchemaWithReferences, {
      $id: 'UserSessionInfo',
    });
  }
}