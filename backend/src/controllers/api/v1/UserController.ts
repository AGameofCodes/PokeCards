import type {Request as Req} from 'express';
import {UniqueViolationError} from 'db-errors';
import {randomUUID} from 'crypto';
import UserRepository from '../../../repository/UserRepository';
import UserInfo from '../../../models/api/v1/user/UserInfo';
import User from '../../../models/db/User';
import {
  Body,
  Controller,
  Delete,
  Get,
  Middlewares,
  Path,
  Post,
  Put,
  Request,
  Response,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa';
import {isAuthenticatedMiddleware} from '../../../middleware/auth';
import {UUID} from '../../../models/api/uuid';
import ApiBaseModelCreatedUpdated from '../../../models/api/ApiBaseModelCreatedUpdated';
import {UUID as nodeUUID} from 'node:crypto';
import * as bcrypt from 'bcrypt';

export interface UserInfoVmV1 extends ApiBaseModelCreatedUpdated {
  /**
   * @minLength 1
   * @maxLength 32
   */
  name: string;
  /**
   * @format email
   * @maxLength 255
   */
  email: string | undefined;
  /**
   * @maxLength 255
   */
  displayName: string;
}

export interface UpdatePasswordRequestV1 {
  userId: UUID;
  password: string;
}

@Route('api/v1/users')
@Tags('users')
@Middlewares(isAuthenticatedMiddleware)
export class UserController extends Controller {
  private repo = new UserRepository();

  @Get()
  @SuccessResponse(200, 'Ok')
  async list(@Request() req: Req): Promise<UserInfoVmV1[]> {
    if (!this.canSeeOtherUsers(req)) {
      const user = await this.repo.getById(req.session.user!.id);
      return [UserInfo.fromUser(user!)];
    }

    const users = await this.repo.getAll();
    return users.map(e => UserInfo.fromUser(e));
  }

  @Get('{id}')
  @SuccessResponse(200, 'Ok')
  @Response(404, 'Not Found')
  async getById(@Path() id: UUID, @Request() req: Req): Promise<UserInfoVmV1> {
    if (!this.canSeeOtherUsers(req) && id !== req.session.user!.id) {
      this.setStatus(404);
      return undefined as any;
    }

    const user = await this.repo.getById(id as nodeUUID);
    if (user !== undefined) {
      return UserInfo.fromUser(user);
    } else {
      this.setStatus(404);
      return undefined as any;
    }
  }

  @Post()
  @SuccessResponse(201, 'Created')
  @Response(403, 'Forbidden')
  @Response(409, 'Conflict')
  async add(@Body() body: UserInfoVmV1, @Request() req: Req): Promise<UserInfoVmV1> {
    if (!this.canSeeOtherUsers(req)) {
      this.setStatus(403);
      return undefined as any;
    }

    let userInfo = UserInfo.fromJson(body);
    let user = User.fromUserInfo(userInfo);

    user.id = randomUUID();
    user.password = undefined;
    user.createdBy = req.session.user!.id;
    user.updatedBy = req.session.user!.id;

    try {
      user = await this.repo.add(user);
      this.setStatus(201);
      return UserInfo.fromUser(user);
    } catch (err) {
      if (err instanceof UniqueViolationError) {
        this.setStatus(409);
        return undefined as any;
      } else {
        throw err;
      }
    }
  }

  @Put()
  @SuccessResponse(200, 'Ok')
  @Response(404, 'Not Found')
  @Response(409, 'Conflict')
  async update(@Body() body: UserInfoVmV1, @Request() req: Req): Promise<UserInfoVmV1> {
    const user = UserInfo.fromJson(body);

    if (!this.canSeeOtherUsers(req) && body.id !== req.session.user!.id) {
      this.setStatus(404);
      return undefined as any;
    }

    //get from db
    const dbuser = await this.repo.getById(user.id);
    if (!dbuser) {
      this.setStatus(404);
      return undefined as any;
    }

    //update props
    dbuser.name = user.name;
    dbuser.displayName = user.displayName;
    dbuser.email = user.email;
    dbuser.updatedBy = req.session.user!.id;

    //save
    try {
      const updated = await this.repo.update(dbuser);
      if (updated) {
        return UserInfo.fromUser(dbuser);
      } else {
        this.setStatus(404);
        return undefined as any;
      }
    } catch (err) {
      if (err instanceof UniqueViolationError) {
        this.setStatus(409);
        return undefined as any;
      } else {
        throw err;
      }
    }
  }

  @Put('/password')
  @SuccessResponse(200, 'Ok')
  @Response(404, 'Not Found')
  async updatePassword(@Body() body: UpdatePasswordRequestV1, @Request() req: Req): Promise<UserInfoVmV1> {
    if (!this.canSeeOtherUsers(req) && body.userId !== req.session.user!.id) {
      this.setStatus(404);
      return undefined as any;
    }

    //get from db
    const dbuser = await this.repo.getById(body.userId as nodeUUID);
    if (!dbuser) {
      this.setStatus(404);
      return undefined as any;
    }

    //update props
    const salt = await bcrypt.genSalt();
    dbuser.password = await bcrypt.hash(body.password, salt);
    dbuser.updatedBy = req.session.user!.id;

    //save
    const updated = await this.repo.update(dbuser);
    if (updated) {
      return UserInfo.fromUser(dbuser);
    } else {
      this.setStatus(404);
      return undefined as any;
    }
  }

  @Delete('{id}')
  @SuccessResponse(204, 'Deleted')
  @Response(404, 'Not Found')
  async remove(@Path() id: UUID, @Request() req: Req): Promise<void> {
    if (!this.canSeeOtherUsers(req) && id !== req.session.user!.id) {
      this.setStatus(404);
      return;
    }

    const deleted = await this.repo.remove(id as nodeUUID, req.session.user!.id);
    if (deleted) {
      this.setStatus(204);
    } else {
      this.setStatus(404);
    }
  }

  private canSeeOtherUsers(req: Req): boolean {
    return false;
  }
}
