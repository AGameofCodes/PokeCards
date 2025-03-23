import type {Request} from 'express';
import type UserInfo from './models/api/v1/user/UserInfo';
import {UUID} from 'node:crypto';

declare module 'express-session' {
  interface SessionData {
    req?: Request;

    authed?: boolean;
    userId?: UUID;
    user?: UserInfo;// todo rename to userInfo
  }
}