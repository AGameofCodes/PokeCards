import type {Request as Req} from 'express';
import CardRepository from '../../../repository/CardRepository';
import Card from '../../../models/db/Card';
import SetModel from '../../../models/db/Set';
import {Controller, Get, Middlewares, Path, Query, Request, Response, Route, SuccessResponse, Tags} from 'tsoa';
import {isAuthenticatedMiddleware} from '../../../middleware/auth';
import {UUID} from '../../../models/api/uuid';
import {fetchCard, fetchCards, mapApiTcgCard2Card} from '../../../tcgApi/TcgApiCardApi';
import SetRepository from '../../../repository/SetRepository';

export interface CardBriefVmV1 {
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
  private setRepo = new SetRepository();

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

    let filter: string[] = [];

    const searchTerms = searchText.split(' ').map(e => ({term: e, number: parseInt(e)}));
    const searchNumbers = searchTerms.filter(e => !isNaN(e.number)).map(e => e.number);
    const searchTexts = searchTerms.filter(e => isNaN(e.number)).map(e => e.term);

    //find sets
    const searchSets: SetModel[] = [];
    const sets = await this.setRepo.getAll();
    for (let [i, text] of searchTexts.entries()) {
      const foundSetsForText = sets.filter(e => text.toLowerCase() === e.abbreviation.toLowerCase());
      if (foundSetsForText.length > 0) {
        searchTexts.splice(i, 1);
        searchSets.push(...foundSetsForText);
      }
    }

    //find ids
    if (searchNumbers.length > 0) {
      const paddedNumbers = ['' + searchNumbers[0],
        ('' + searchNumbers[0]).padStart(2, '0'),
        ('' + searchNumbers[0]).padStart(3, '0'),
        ('' + searchNumbers[0]).padStart(4, '0'),
      ];
      filter.push('localId=eq:' + paddedNumbers.join('|'));
    }

    const cards: CardBriefVmV1[] = [];
    for (let language of languages) {
      //prepare filter for this language
      const languageSpecificFilter = [...filter];
      if (searchSets.length > 0) {
        const setIds = [...new Set(searchSets.filter(e => e.language === language).map(e => e.id))];
        if (setIds.length > 0) {
          languageSpecificFilter.push('set.id=eq:' + setIds.join('|'));
        } else {
          //sets where found but not for this language so we don't search for this language
          continue;
        }
      }
      if (searchTexts.length > 0) {
        languageSpecificFilter.push('name=' + searchTexts.join(' '));
      }

      //no search params -> no search
      if (!languageSpecificFilter.length) {
        continue;
      }

      //fetch cards
      const apiCards = await fetchCards(language, languageSpecificFilter);
      if (apiCards) {
        for (const card of apiCards) {
          if (!cards.find(e => e.id === card.id && e.language === card.language)) {
            cards.push(card);
          }
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
