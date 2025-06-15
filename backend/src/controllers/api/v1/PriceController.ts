import type {Request as Req} from 'express';
import {Controller, Get, Middlewares, Path, Query, Request, Response, Route, SuccessResponse, Tags} from 'tsoa';
import {isAuthenticatedMiddleware} from '../../../middleware/auth';
import * as pokemonTcgCardApi from '../../../pokemonTcgIoApi/PokemonTcgIoCardApi';
import SetMappingRepository from '../../../repository/SetMappingRepository';
import CardPriceRepository from '../../../repository/CardPriceRepository';
import CardPrice, {emptyCardMarket} from '../../../models/db/CardPrice';
import {QueryBuilder} from 'objection';


interface PriceVmV1 {
  /**
   * @minLength 1
   * @maxLength 255
   */
  id: string;
  cardmarket: {
    url: string,
    updatedAt: string; //e.g. 2021/08/04,
    prices: {
      averageSellPrice: number | null | undefined,
      lowPrice: number | null | undefined,
      trendPrice: number | null | undefined,
      germanProLow: number | null | undefined,
      suggestedPrice: number | null | undefined,
      reverseHoloSell: number | null | undefined,
      reverseHoloLow: number | null | undefined,
      reverseHoloTrend: number | null | undefined,
      lowPriceExPlus: number | null | undefined,
      avg1: number | null | undefined,
      avg7: number | null | undefined,
      avg30: number | null | undefined,
      reverseHoloAvg1: number | null | undefined,
      reverseHoloAvg7: number | null | undefined,
      reverseHoloAvg30: number | null | undefined,
    }
  };
}

@Route('api/v1/prices')
@Middlewares(isAuthenticatedMiddleware)
@Tags('prices')
export class PriceController extends Controller {
  private cardPriceRepo = new CardPriceRepository();
  private mappingRepo = new SetMappingRepository();

  @Get('card')
  @SuccessResponse(200, 'Ok')
  async listForCards(@Query('id') ids: string[], @Request() req: Req): Promise<PriceVmV1[]> {
    //bug in openapi/tsoa see https://github.com/lukeautry/tsoa/issues/219
    if (ids.length === 1 && ids[0]!.includes(',')) {
      ids = ids[0]!.split(',');
    }

    let filters: ((query: QueryBuilder<CardPrice, CardPrice[]>) => QueryBuilder<CardPrice, CardPrice[]>)[] = [];
    if (ids.length > 0) {
      filters.push(q => q.whereIn('id', ids));
    }

    return await this.cardPriceRepo.getAll(undefined, filters);
  }

  @Get('card/{id}')
  @SuccessResponse(200, 'Ok')
  @Response(404, 'Not Found')
  async getByCardId(@Path() id: string, @Request() req: Req): Promise<PriceVmV1> {
    //from cache
    let cardPrice = await this.cardPriceRepo.getById(id);
    if (cardPrice !== undefined) {
      cardPrice = await this.updateIfNeeded(cardPrice);
      return cardPrice;
    }

    //from api
    const idSplit = id.split('-');
    const tcgDexNetSetId = idSplit.slice(0, idSplit.length - 1).join('-');
    const setMapping = await this.mappingRepo.getByTcgDexNetId(tcgDexNetSetId);
    if (!setMapping) {
      this.setStatus(404);
      return undefined as any;
    }

    const pokemonTcgIoId = setMapping.pokemonTcgIoId + '-' + parseInt(idSplit[idSplit.length - 1]!);
    const apiCard = await pokemonTcgCardApi.fetchCard(pokemonTcgIoId);
    if (apiCard !== undefined) {
      const prices = CardPrice.new(id, apiCard.cardmarket ?? emptyCardMarket());
      await this.cardPriceRepo.add(prices);
      return prices;
    }

    //not found
    this.setStatus(404);
    return undefined as any;
  }

  private async updateIfNeeded(prices: CardPrice): Promise<CardPrice> {
    if (prices.updatedAt.getTime() + 24 * 60 * 60 * 1000 < Date.now()) {
      const setMapping = await this.mappingRepo.getByTcgDexNetId(prices.id);
      if (!setMapping) {
        this.setStatus(404);
        return undefined as any;
      }

      const pokemonTcgIoId = setMapping.pokemonTcgIoId + '-' + prices.id.split('-')[-1];
      const apiCard = await pokemonTcgCardApi.fetchCard(pokemonTcgIoId);
      if (apiCard !== undefined) {
        const updatedPrices = CardPrice.new(prices.id, apiCard.cardmarket ?? emptyCardMarket());
        await this.cardPriceRepo.update(updatedPrices);
        return updatedPrices;
      }
    }
    return prices;
  }
}
