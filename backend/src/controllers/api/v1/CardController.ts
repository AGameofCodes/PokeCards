import type {Request as Req} from 'express';
import CardRepository from '../../../repository/CardRepository';
import Card from '../../../models/db/Card';
import {Controller, Get, Middlewares, Path, Query, Request, Response, Route, SuccessResponse, Tags} from 'tsoa';
import {isAuthenticatedMiddleware} from '../../../middleware/auth';
import {UUID} from '../../../models/api/uuid';
import {fetchCard, fetchCards, mapApiTcgCard2Card} from '../../../tcgApi/TcgApiCardApi';
import {validateTcpApiResponse} from './util';

interface CardBriefVmV1 {
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
  image: string;
  /**
   * @minLength 1
   * @maxLength 15
   */
  language: string;
}

interface CardVmV1 {
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
  setId: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  number: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  image: string;
  /**
   * @maxLength 255
   */
  rarity: string | null | undefined;
  variants: {
    firstEdition?: boolean,
    holo?: boolean,
    normal?: boolean,
    reverse?: boolean,
    wPromo?: boolean,
  };
  /**
   * @minLength 2
   * @maxLength 15
   */
  language: string;
}

@Route('api/v1/cards')
@Middlewares(isAuthenticatedMiddleware)
@Tags('cards')
export class CardController extends Controller {
  private repo = new CardRepository();

  @Get()
  @SuccessResponse(200, 'Ok')
  async list(@Request() req: Req): Promise<CardVmV1[]> {
    return this.repo.getAll();
  }

  @Get('search')
  @SuccessResponse(200, 'Ok')
  async search(@Query('q') searchText: string, @Query('lang') languages: string[], @Request() req: Req): Promise<CardBriefVmV1[]> {
    //bug in openapi/tsoa see https://github.com/lukeautry/tsoa/issues/219
    if (languages.length === 1 && languages[0]!.includes(',')) {
      languages = languages[0]!.split(',');
    }

    const cards: CardBriefVmV1[] = [];
    for (let language of languages) {
      const byId = (await fetchCards(language, ['id=like:' + searchText])) ?? [];
      const byName = (await fetchCards(language, ['name=like:' + searchText])) ?? [];
      for (const card of byId) {
        if (!cards.find(e => e.id === card.id && e.language === card.language)) {
          cards.push(card);
        }
      }
      for (const card of byName) {
        if (!cards.find(e => e.id === card.id && e.language === card.language)) {
          cards.push(card);
        }
      }
    }
    return cards;
  }

  @Get('{uid}')
  @SuccessResponse(200, 'Ok')
  @Response(404, 'Not Found')
  async getByUid(@Path() uid: string, @Request() req: Req): Promise<CardVmV1> {
    //from cache
    let card = await this.repo.getByUid(uid);
    if (card !== undefined) {
      card = await this.updateIfNeeded(card);
      return card;
    }

    //not found
    this.setStatus(404);
    return undefined as any;
  }

  @Get('{language}/{id}')
  @SuccessResponse(200, 'Ok')
  @Response(404, 'Not Found')
  async getByLanguageAndId(@Path() language: string, @Path() id: string, @Request() req: Req): Promise<CardVmV1> {
    //validate language

    //from cache
    let card = await this.repo.getByLanguageAndId(language, id);
    if (card !== undefined) {
      card = await this.updateIfNeeded(card);
      return card;
    }

    //from api
    const apiCard = await fetchCard(language, id);
    if (apiCard !== undefined) {
      card = mapApiTcgCard2Card(apiCard, language);
      await this.repo.add(card);
      return card;
    }

    //not found
    this.setStatus(404);
    return undefined as any;
  }

  private async updateIfNeeded(card: Card): Promise<Card> {
    if (card.updatedAt.getTime() + 24 * 60 * 60 * 1000 < Date.now()) {
      const apiCard = await fetchCard(card.language, card.id);
      if (apiCard !== undefined) {
        const updatedCard = mapApiTcgCard2Card(apiCard, card.language);
        updatedCard.uid = card.uid;
        await this.repo.update(updatedCard);
        return updatedCard;
      }
    }
    return card;
  }
}
