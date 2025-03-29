import type {Request as Req} from 'express';
import CardRepository from '../../../repository/CardRepository';
import Card from '../../../models/db/Card';
import {Controller, Get, Middlewares, Path, Query, Request, Response, Route, SuccessResponse, Tags} from 'tsoa';
import {isAuthenticatedMiddleware} from '../../../middleware/auth';
import TcgCardBrief from '../../../models/tcgApi/TcgCardBrief';
import TcgCard from '../../../models/tcgApi/TcgCard';
import {randomUUID} from 'crypto';
import {UUID} from '../../../models/api/uuid';
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
      const byId: CardBriefVmV1[] = await fetch('https://api.tcgdex.net/v2/' + language + '/cards?id=like:' + searchText)
        .then(res => validateTcpApiResponse(res))
        .then(res => res.json())
        .then(res => res.map((e: TcgCardBrief) => this.mapTcgCardBrief2CardBriefVmV1(e, language)))
        .catch(e => {
          console.error('Failed to search card by id for ' + searchText, e);
          return [];
        });
      const byName: CardBriefVmV1[] = await fetch('https://api.tcgdex.net/v2/' + language + '/cards?name=like:' + searchText)
        .then(res => validateTcpApiResponse(res))
        .then(res => res.json())
        .then(res => res.map((e: TcgCardBrief) => this.mapTcgCardBrief2CardBriefVmV1(e, language)))
        .catch(e => {
          console.error('Failed to search card by name for ' + searchText, e);
          return [];
        });
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
    const apiCard = await fetch('https://api.tcgdex.net/v2/' + language + '/cards/' + id)
      .then(res => validateTcpApiResponse(res))
      .then(res => res.json())
      .catch(e => console.error('Failed to fetch card ' + language + '/' + id, e));
    if (apiCard !== undefined) {
      card = this.mapTcgCard2Card(apiCard, language);
      await this.repo.add(card);
      return card;
    }

    //not found
    this.setStatus(404);
    return undefined as any;
  }

  private mapTcgCardBrief2CardBriefVmV1(brief: TcgCardBrief, language: string): CardBriefVmV1 {
    return {
      id: brief.id,
      name: brief.name,
      image: brief.image,
      language: language,
    };
  }

  private mapTcgCard2Card(card: TcgCard, language: string): Card {
    return Card.new(randomUUID(), card.id, card.name, card.set.id, card.localId, card.image ?? '', card.rarity, card.variants, language);
  }

  private async updateIfNeeded(card: Card): Promise<Card> {
    if (card.updatedAt.getTime() + 24 * 60 * 60 * 1000 < Date.now()) {
      const apiCard = await fetch('https://api.tcgdex.net/v2/' + card.language + '/cards/' + card.id)
        .then(res => validateTcpApiResponse(res))
        .then(res => res.json())
        .catch(e => console.error('updateIfNeeded: Failed to fetch card ' + card.language + '/' + card.id, e));
      if (apiCard !== undefined) {
        const updatedCard = this.mapTcgCard2Card(apiCard, card.language);
        updatedCard.uid = card.uid;
        await this.repo.update(updatedCard);
        return updatedCard;
      }
    }
    return card;
  }
}
