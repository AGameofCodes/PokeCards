import type {Request as Req} from 'express';
import {randomUUID} from 'crypto';
import UserCardRepository from '../../../repository/UserCardRepository';
import UserCard from '../../../models/db/UserCard';
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
import ApiBaseModelId from '../../../models/api/ApiBaseModelId';
import {setEqual} from '../../../util/set';

interface UserCardLabelVmV1 extends ApiBaseModelId {
  labelId: UUID;
  userCardId: UUID;
  /**
   * @maxLength 255
   */
  value: string | null | undefined;
}

interface UserCardVmV1 extends ApiBaseModelCreatedUpdated {
  cardUid: UUID;
  labels: UserCardLabelVmV1[];
}

@Route('api/v1/usercards')
@Middlewares(isAuthenticatedMiddleware)
@Tags('userCards')
export class UserCardController extends Controller {
  private repo = new UserCardRepository();

  @Get()
  @SuccessResponse(200, 'Ok')
  async list(@Request() req: Req): Promise<UserCardVmV1[]> {
    return this.repo.getAll(req.session.user!.id);
  }

  @Get('{id}')
  @SuccessResponse(200, 'Ok')
  @Response(404, 'Not Found')
  async getById(@Path() id: UUID, @Request() req: Req): Promise<UserCardVmV1> {
    const userCard = await this.repo.getById(id as nodeUUID, req.session.user!.id);
    if (userCard !== undefined) {
      return userCard;
    } else {
      this.setStatus(404);
      return undefined as any;
    }
  }

  @Post()
  @SuccessResponse(201, 'Created')
  @Response(409, 'Conflict')
  async add(@Body() body: UserCardVmV1, @Request() req: Req): Promise<UserCardVmV1> {
    let card = UserCard.fromJson(body);

    card.id = randomUUID();
    card.createdBy = req.session.user!.id;
    card.updatedBy = req.session.user!.id;

    card = await this.repo.add(card);
    this.setStatus(201);
    return card;
  }

  @Put()
  @SuccessResponse(200, 'Ok')
  @Response(400, 'BadRequest')
  @Response(404, 'Not Found')
  async update(@Body() body: UserCardVmV1, @Request() req: Req): Promise<UserCardVmV1> {
    const card = UserCard.fromJson(body);

    //get from db
    const dbCard = await this.repo.getById(card.id, req.session.user!.id);
    if (!dbCard) {
      this.setStatus(404);
      return undefined as any;
    }

    //validate labels
    const cardLabelIds = new Set(card.labels.map(e => e.id).filter(e => e !== '00000000-0000-0000-0000-000000000000'));
    const dbCardLabelIds = new Set(dbCard.labels.map(e => e.id));
    if (!setEqual(cardLabelIds, dbCardLabelIds)) { // ensure that all labels which are to be updated (have an id) exist on the dbCard
      this.setStatus(400);
      return undefined as any;
    }

    card.labels.forEach(e => e.userCardId = card.id);
    card.labels = card.labels.filter(e => !!e.value?.trim()); // drop empty labels

    //update props
    dbCard.cardUid = card.cardUid;
    dbCard.labels = card.labels;
    dbCard.updatedBy = req.session.user!.id;

    //save
    const updated = await this.repo.update(dbCard);
    if (updated) {
      return dbCard;
    } else {
      this.setStatus(404);
      return undefined as any;
    }
  }

  @Delete('{id}')
  @SuccessResponse(204, 'Deleted')
  @Response(404, 'Not Found')
  async remove(@Path() id: UUID, @Request() req: Req): Promise<void> {
    const deleted = await this.repo.remove(id as nodeUUID, req.session.user!.id);
    if (deleted) {
      this.setStatus(204);
    } else {
      this.setStatus(404);
    }
  }
}
