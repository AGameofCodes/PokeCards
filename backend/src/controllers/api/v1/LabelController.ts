import type {Request as Req} from 'express';
import {UniqueViolationError} from 'db-errors';
import {randomUUID} from 'crypto';
import LabelRepository from '../../../repository/LabelRepository';
import Label from '../../../models/db/Label';
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

interface LabelVmV1 extends ApiBaseModelCreatedUpdated {
  /**
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /**
   * @maxLength 32
   */
  type: string;
  /**
   * @maxLength 1024
   */
  enumValues: string | null | undefined;
  /**
   * @maxLength 32
   */
  color: string;
}

@Route('api/v1/labels')
@Middlewares(isAuthenticatedMiddleware)
@Tags('labels')
export class LabelController extends Controller {
  private repo = new LabelRepository();

  @Get()
  @SuccessResponse(200, 'Ok')
  async list(@Request() req: Req): Promise<LabelVmV1[]> {
    return this.repo.getAll(req.session.user!.id);
  }

  @Get('{id}')
  @SuccessResponse(200, 'Ok')
  @Response(404, 'Not Found')
  async getById(@Path() id: UUID, @Request() req: Req): Promise<LabelVmV1> {
    const label = await this.repo.getById(id as nodeUUID, req.session.user!.id);
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
  async add(@Body() body: LabelVmV1, @Request() req: Req): Promise<LabelVmV1> {
    let label = Label.fromJson(body);

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
  async update(@Body() body: LabelVmV1, @Request() req: Req): Promise<LabelVmV1> {
    const label = Label.fromJson(body);

    //get from db
    const dblabel = await this.repo.getById(label.id, req.session.user!.id);
    if (!dblabel) {
      this.setStatus(404);
      return undefined as any;
    }

    //update props
    dblabel.name = label.name;
    dblabel.type = label.type;
    dblabel.enumValues = label.enumValues;
    dblabel.color = label.color;
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
