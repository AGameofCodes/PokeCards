import type {Request as Req} from 'express';
import {UniqueViolationError} from 'db-errors';
import {randomUUID} from 'crypto';
import CardRepository from '../../../repository/CardRepository';
import Card from '../../../models/db/Card';
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

interface CardVmV1 extends ApiBaseModelCreatedUpdated {
  /**
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /**
   * @maxLength 32767
   */
  description: string;
  /**
   * @maxLength 32
   */
  unit: string;
  /**
   * @maxLength 32
   */
  color: string;
  minReference: number;
  maxReference: number;
}

@Route('api/v1/cards')
@Middlewares(isAuthenticatedMiddleware)
@Tags('cards')
export class CardController extends Controller {
  private repo = new CardRepository();

  @Get()
  @SuccessResponse(200, 'Ok')
  async list(@Request() req: Req): Promise<CardVmV1[]> {
    return this.repo.getAll(req.session.user!.id);
  }

  @Get('{id}')
  @SuccessResponse(200, 'Ok')
  @Response(404, 'Not Found')
  async getById(@Path() id: UUID, @Request() req: Req): Promise<CardVmV1> {
    const label = await this.repo.getById(req.session.user!.id, id as nodeUUID);
    if (label !== undefined) {
      return label;
    } else {
      this.setStatus(404);
      return undefined as any;
    }
  }

  @Post()
  @SuccessResponse(201, 'Created')
  @Response(409, 'Conflict')
  async add(@Body() body: CardVmV1, @Request() req: Req): Promise<CardVmV1> {
    let label = Card.fromJson(body);

    label.id = randomUUID();
    label.createdBy = req.session.user!.id;
    label.updatedBy = req.session.user!.id;

    try {
      label = await this.repo.add(label);
      this.setStatus(201);
      return label;
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
  async update(@Body() body: CardVmV1, @Request() req: Req): Promise<CardVmV1> {
    const label = Card.fromJson(body);

    //get from db
    const dblabel = await this.repo.getById(label.id, req.session.user!.id);
    if (!dblabel) {
      this.setStatus(404);
      return undefined as any;
    }

    //update props
    dblabel.name = label.name;
    dblabel.description = label.description;
    dblabel.unit = label.unit;
    dblabel.color = label.color;
    dblabel.minReference = label.minReference;
    dblabel.maxReference = label.maxReference;
    dblabel.updatedBy = req.session.user!.id;

    //save
    try {
      const updated = await this.repo.update(dblabel);
      if (updated) {
        return dblabel;
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
