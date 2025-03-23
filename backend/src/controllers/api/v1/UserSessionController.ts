import type {Request as Req} from 'express';
import UserSessionRepository from '../../../repository/UserSessionRepository';
import UserSessionInfo from '../../../models/api/v1/user/UserSessionInfo';
import {Controller, Delete, Get, Middlewares, Path, Request, Response, Route, SuccessResponse, Tags} from 'tsoa';
import {isAuthenticatedMiddleware} from '../../../middleware/auth';
import {UUID} from '../../../models/api/uuid';
import ApiBaseModelId from '../../../models/api/ApiBaseModelId';
import {UUID as nodeUUID} from 'node:crypto';

export interface UserSessionInfoVmV1 extends ApiBaseModelId {
}

@Route('api/v1/usersessions')
@Middlewares(isAuthenticatedMiddleware)
@Tags('usersessions')
export class UserSessionController extends Controller {
  private repo = new UserSessionRepository();

  @Get()
  @SuccessResponse(200, 'Ok')
  async list(@Request() req: Req): Promise<UserSessionInfoVmV1[]> {
    const sessions = await this.repo.getByUserId(req.session.user!.id);
    return sessions.map(e => UserSessionInfo.fromSession(e));
  }

  @Delete('{id}')
  @SuccessResponse(204, 'Deleted')
  @Response(401, 'Unauthorized')
  @Response(404, 'Not Found')
  async remove(@Path() id: UUID, @Request() req: Req): Promise<void> {
    const session = await this.repo.getById(id as nodeUUID);
    if (session === undefined) {
      this.setStatus(401);//don't expose that we do not have the data
      return undefined as any;
    }

    if (session.userId !== req.session.user!.id) {
      this.setStatus(401);
      return undefined as any;
    }

    const deleted = await this.repo.remove(id as nodeUUID);
    if (deleted) {
      this.setStatus(204);
    } else {
      this.setStatus(404);
    }
  }
}
