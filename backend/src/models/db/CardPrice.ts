import type {JSONSchema, ModelOptions, Pojo, StaticHookArguments} from 'objection';
import BaseModel from './BaseModel';

export interface CardMarket {
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
  };
}

export function emptyCardMarket(): CardMarket {
  return {
    url: '',
    updatedAt: '0001/01/01',
    prices: {
      averageSellPrice: undefined,
      avg1: undefined,
      avg7: undefined,
      avg30: undefined,
      lowPrice: undefined,
      germanProLow: undefined,
      lowPriceExPlus: undefined,
      trendPrice: undefined,
      suggestedPrice: undefined,
      reverseHoloAvg1: undefined,
      reverseHoloLow: undefined,
      reverseHoloTrend: undefined,
      reverseHoloSell: undefined,
      reverseHoloAvg30: undefined,
      reverseHoloAvg7: undefined,
    },
  }
}

export default class CardPrice extends BaseModel {
  id!: string; //min 1, max length 255
  cardmarket!: CardMarket;
  updatedAt!: Date;

  static new(id: string, cardmarket: CardMarket): CardPrice {
    const ret = new CardPrice();
    ret.id = id;
    ret.cardmarket = cardmarket;
    ret.updatedAt = new Date();
    return ret;
  }

  static override get tableName(): string {
    return 'cardPrices';
  }

  static override get jsonSchemaWithReferences(): JSONSchema {
    return {
      $id: 'CardPrice',
      type: 'object',
      required: ['id', 'cardmarket', 'updatedAt'],

      properties: {
        id: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        cardmarket: {
          type: 'object',
          required: ['url', 'updatedAt', 'prices'],
          properties: {
            url: {type: 'string', minLength: 1, maxLength: 255},
            updatedAt: {type: 'string', minLength: 1, maxLength: 32},
            prices: {
              type: 'object',
              properties: {
                averageSellPrice: {type: 'number'},
                lowPrice: {type: 'number'},
                trendPrice: {type: 'number'},
                germanProLow: {type: 'number'},
                suggestedPrice: {type: 'number'},
                reverseHoloSell: {type: 'number'},
                reverseHoloLow: {type: 'number'},
                reverseHoloTrend: {type: 'number'},
                lowPriceExPlus: {type: 'number'},
                avg1: {type: 'number'},
                avg7: {type: 'number'},
                avg30: {type: 'number'},
                reverseHoloAvg1: {type: 'number'},
                reverseHoloAvg7: {type: 'number'},
                reverseHoloAvg30: {type: 'number'},
              },
            },
          },
        },
        updatedAt: {type: 'string', format: 'date-time'},
      },
    };
  }

  override $beforeInsert(): void {
    this.updatedAt = new Date();
  }

  override $beforeUpdate(): void {
    this.updatedAt = new Date();
  }

  static override afterFind(args: StaticHookArguments<CardPrice>): void {
    args.result.forEach((card: CardPrice) => {
      card.updatedAt = card.updatedAt && new Date(card.updatedAt);
    });
  }

  override $beforeValidate(jsonSchema: JSONSchema, json: Pojo, opt: ModelOptions): JSONSchema {
    if (['number', 'object'].includes(typeof json.updatedAt)) {
      json.updatedAt = json.updatedAt && new Date(json.updatedAt).toISOString() as any;
    }
    return super.$beforeValidate(jsonSchema, json, opt);
  }

  override $set(obj: Pojo): this {
    super.$set(obj);

    if (['number', 'string'].includes(typeof obj.updatedAt)) {
      this.updatedAt = new Date(obj.updatedAt);
    }
    return this;
  }
}