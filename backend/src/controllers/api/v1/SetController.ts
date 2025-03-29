import type {Request as Req} from 'express';
import SetRepository from '../../../repository/SetRepository';
import Set from '../../../models/db/Set';
import {Controller, Get, Middlewares, Path, Request, Response, Route, SuccessResponse, Tags} from 'tsoa';
import {isAuthenticatedMiddleware} from '../../../middleware/auth';
import TcgSet from '../../../models/tcgApi/TcgSet';
import {randomUUID} from 'crypto';
import {UUID} from '../../../models/api/uuid';
import {validateTcpApiResponse} from './util';

interface SetVmV1 {
  /**
   * @minLength 1
   * @maxLength 255
   */
  uid: UUID;
  /**
   * @minLength 1
   * @maxLength 255
   */
  id: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  serieId: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  logo: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  symbol: string;
  /**
   * @format date
   */
  releaseDate: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  abbreviation: string;
  /**
   * @minLength 2
   * @maxLength 15
   */
  language: string;
}

@Route('api/v1/sets')
@Middlewares(isAuthenticatedMiddleware)
@Tags('sets')
export class SetController extends Controller {
  private repo = new SetRepository();

  @Get()
  @SuccessResponse(200, 'Ok')
  async list(@Request() req: Req): Promise<SetVmV1[]> {
    return this.repo.getAll();
  }

  @Get('{uid}')
  @SuccessResponse(200, 'Ok')
  @Response(404, 'Not Found')
  async getByUid(@Path() uid: string, @Request() req: Req): Promise<SetVmV1> {
    //from cache
    let set = await this.repo.getByUid(uid);
    if (set !== undefined) {
      set = await this.updateIfNeeded(set);
      return set;
    }

    //not found
    this.setStatus(404);
    return undefined as any;
  }

  @Get('{language}/{id}')
  @SuccessResponse(200, 'Ok')
  @Response(404, 'Not Found')
  async getByLanguageAndId(@Path() language: string, @Path() id: string, @Request() req: Req): Promise<SetVmV1> {
    //validate language

    //from cache
    let set = await this.repo.getByLanguageAndId(language, id);
    if (set !== undefined) {
      set = await this.updateIfNeeded(set);
      return set;
    }

    //from api
    const apiSet = await fetch('https://api.tcgdex.net/v2/' + language + '/sets/' + id)
      .then(res => validateTcpApiResponse(res))
      .then(res => res.json())
      .catch(e => console.error('Failed to fetch set ' + language + '/' + id, e));
    if (apiSet !== undefined) {
      set = this.mapTcgSet2Set(apiSet, language);
      await this.repo.add(set);
      return set;
    }

    //not found
    this.setStatus(404);
    return undefined as any;
  }

  private mapTcgSet2Set(set: TcgSet, language: string): Set {
    return Set.new(randomUUID(), set.id, set.name, set.serie.id, set.logo, set.symbol, set.releaseDate, set.abbreviation?.official ?? '', language);
  }


  private async updateIfNeeded(set: Set): Promise<Set> {
    if (set.updatedAt.getTime() + 24 * 60 * 60 * 1000 < Date.now()) {
      const apiSet = await fetch('https://api.tcgdex.net/v2/' + set.language + '/sets/' + set.id)
        .then(res => validateTcpApiResponse(res))
        .then(res => res.json())
        .catch(e => console.error('updateIfNeeded: Failed to fetch set ' + set.language + '/' + set.id, e));
      if (apiSet !== undefined) {
        const updatedSet = this.mapTcgSet2Set(apiSet, set.language);
        updatedSet.uid = set.uid;
        await this.repo.update(updatedSet);
        return updatedSet;
      }
    }
    return set;
  }
}
