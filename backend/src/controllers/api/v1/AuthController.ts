import * as bcrypt from 'bcrypt';
import type {Request as Req} from 'express';
import {LogoutResponse} from '../../../models/api/v1/auth/LogoutModels';
import {ConfigProvider} from '../../../config/confighelper';
import {isAuthenticated} from '../../../middleware/auth';
import {LoginRequest, LoginResponse} from '../../../models/api/v1/auth/LoginModels';
import {RegisterRequest, RegisterResponse} from '../../../models/api/v1/auth/RegisterModels';
import User from '../../../models/db/User';
import UserRepository from '../../../repository/UserRepository';
import UserSessionRepository from '../../../repository/UserSessionRepository';
import {VerifyResponse} from '../../../models/api/v1/auth/VerifyModels';
import UserInfo from '../../../models/api/v1/user/UserInfo';
import UserSessionInfo from '../../../models/api/v1/user/UserSessionInfo';
import {Body, Controller, Post, Request, Response, Route, SuccessResponse, Tags} from 'tsoa';
import {UserInfoVmV1} from './UserController';
import {UserSessionInfoVmV1} from './UserSessionController';
import {Inject} from 'typescript-ioc';
import {UUID} from 'node:crypto';

interface RegisterRequestVmV1 {
  /**
   * @minLength 1
   * @maxLength 32
   */
  username: string;
  /**
   * @maxLength 255
   */
  password: string;
}

interface RegisterResponseVmV1 {
  success: boolean;
  user?: UserInfoVmV1;
  session?: UserSessionInfoVmV1;
  message?: string;
}

interface LoginRequestVmV1 {
  /**
   * @minLength 1
   * @maxLength 32
   */
  username: string;
  /**
   * @maxLength 255
   */
  password: string;
}

interface LoginResponseVmV1 {
  success: boolean;
  user?: UserInfoVmV1;
  session?: UserSessionInfoVmV1;
  message?: string;
}

interface VerifyResponseVmV1 {
  success: boolean;
  user?: UserInfoVmV1;
  session?: UserSessionInfoVmV1;
  message?: string;
}

interface LogoutResponseVmV1 {
  success: boolean;
  message: string | undefined;
}

@Route('api/v1/auth')
@Tags('auth')
export class AuthController extends Controller {
  private readonly userRepo = new UserRepository();
  private readonly sessionRepo = new UserSessionRepository();

  private readonly config: ConfigProvider;

  constructor(@Inject config: ConfigProvider) {
    super();
    this.config = config;
  }

  @Post('register')
  @SuccessResponse(200, 'Ok')
  @Response(403, 'Forbidden')
  @Response(409, 'Conflict')
  async register(@Body() body: RegisterRequestVmV1, @Request() req: Req): Promise<RegisterResponseVmV1> {
    if (!(await this.config.get()).server.features.auth.register) {
      this.setStatus(403);
      return RegisterResponse.REGISTRATION_DISABLED;
    }

    const register = RegisterRequest.fromJson(body);
    let user = await this.userRepo.getByName(register.username);
    if (user !== undefined) {
      this.setStatus(409);
      return RegisterResponse.USER_ALREADY_EXISTS;//conflict
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(register.password, salt);

    const uuid = crypto.randomUUID() as UUID;
    user = User.new(uuid, register.username, register.username, hash, uuid);
    await this.userRepo.add(user);

    await this.generateSession(req, user);
    const userInfo = UserInfo.fromUser(user);
    const session = (await this.sessionRepo.getById(req.session.id as UUID))!;
    const sessionInfo = UserSessionInfo.fromSession(session);
    return RegisterResponse.success(userInfo, sessionInfo);
  }

  @Post('login')
  @SuccessResponse(200, 'Ok')
  @Response(401, 'Unauthorized')
  async login(@Body() body: LoginRequestVmV1, @Request() req: Req): Promise<LoginResponseVmV1> {
    const login = LoginRequest.fromJson(body);
    const user = await this.userRepo.getByName(login.username);
    if (user === undefined) {//TODO prevent timing side channel
      this.setStatus(401);
      return LoginResponse.USERNAME_OR_PASSWORD_WRONG;
    }

    const success = user.password && await bcrypt.compare(login.password, user.password);
    if (!success) {
      this.setStatus(401);
      return LoginResponse.USERNAME_OR_PASSWORD_WRONG;
    }

    await this.generateSession(req, user);
    const userInfo = UserInfo.fromUser(user);
    const session = (await this.sessionRepo.getById(req.session.id as UUID))!;
    const sessionInfo = UserSessionInfo.fromSession(session);
    return LoginResponse.success(userInfo, sessionInfo);
  }

  @Post('verify')
  @SuccessResponse(200, 'Ok')
  @Response(401, 'Unauthorized')
  async verify(@Request() req: Req): Promise<VerifyResponseVmV1> {
    if (!isAuthenticated(req)) {
      this.setStatus(401);
      return VerifyResponse.NOT_AUTHENTICATED;
    }
    const user = (await this.userRepo.getById(req.session.userId!))!;
    const userInfo = UserInfo.fromUser(user);
    const session = (await this.sessionRepo.getById(req.session.id as UUID))!;
    const sessionInfo = UserSessionInfo.fromSession(session);
    return VerifyResponse.success(userInfo, sessionInfo);
  }

  @Post('logout')
  @SuccessResponse(200, 'Ok')
  async logout(@Request() req: Req): Promise<LogoutResponseVmV1> {
    if (!isAuthenticated(req)) {
      return LogoutResponse.SUCCESS;
    }

    await this.destroySession(req);
    return LogoutResponse.SUCCESS;
  }

  private generateSession(req: Req, user: User): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.regenerate(function (err) {
        if (err) {
          reject(err);
          return;
        }
        req.session.authed = true;
        req.session.userId = user.id;
        req.session.user = UserInfo.fromUser(user);
        req.session.save(function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  }

  private destroySession(req: Req): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy(function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

