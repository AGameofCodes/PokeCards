import type {Request as Req} from 'express';
import CardRepository from '../../../repository/CardRepository';
import Card from '../../../models/db/Card';
import {Controller, Get, Middlewares, Path, Query, Request, Response, Route, SuccessResponse, Tags} from 'tsoa';
import {isAuthenticatedMiddleware} from '../../../middleware/auth';
import TcgCardBrief from '../../../models/tcgApi/TcgCard';
import TcgCard from '../../../models/tcgApi/TcgCardBrief';
import {randomUUID} from 'crypto';
import {UUID} from '../../../models/api/uuid';

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
  async search(@Query('q') searchText: string, @Request() req: Req): Promise<CardBriefVmV1[]> {
    const byId: CardBriefVmV1[] = await fetch('https://api.tcgdex.net/v2/en/cards?id=like:' + searchText)
      .then(res => this.validateTcpApiResponse(res))
      .then(res => res.json())
      .then(res => res.map((e: TcgCardBrief) => this.mapTcgCardBrief2CardBriefVmV1(e, 'en')))
      .catch(e => {
        console.error('Failed to search card by id for ' + searchText, e);
        return [];
      });
    const byName: CardBriefVmV1[] = await fetch('https://api.tcgdex.net/v2/en/cards?name=like:' + searchText)
      .then(res => this.validateTcpApiResponse(res))
      .then(res => res.json())
      .then(res => res.map((e: TcgCardBrief) => this.mapTcgCardBrief2CardBriefVmV1(e, 'en')))
      .catch(e => {
        console.error('Failed to search card by name for ' + searchText, e);
        return [];
      });
    const cards = [...byId];
    for (const card of byName) {
      if (!cards.find(e => e.id === card.id)) {
        cards.push(card);
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
      return card;
    }

    //from api
    const apiCard = await fetch('https://api.tcgdex.net/v2/' + language + '/cards/' + id)
      .then(res => this.validateTcpApiResponse(res))
      .then(res => res.json())
      .catch(e => console.error('Failed to fetch card ' + language + '/' + id, e));
    if (apiCard !== undefined) {
      card = this.mapTcgCard2Card(apiCard, 'en');
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
    return Card.new(randomUUID(), card.id, card.name, card.set.id, card.localId, card.image ?? '', language);
  }

  private async validateTcpApiResponse(res: Response): Promise<Response> {
    if (200 <= res.status && res.status < 300) {
      return res;
    } else {
      throw new Error('TcgApi returned non-ok status code with body: ' + await res.text());
    }
  }
}
