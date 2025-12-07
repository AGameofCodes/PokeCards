import type {JSONSchema, ModelOptions, Pojo, StaticHookArguments} from 'objection';
import {UUID} from 'node:crypto';
import BaseModel from './BaseModel';

export type Variants = {
  firstEdition?: boolean,
  holo?: boolean,
  normal?: boolean,
  reverse?: boolean,
  wPromo?: boolean,
};

export type CardMarketPricing = {
  updatedAt?: string;
  unit?: string,
  avg?: number,
  low?: number,
  trend?: number,
  avg1?: number,
  avg7?: number,
  avg30?: number,
  'avg-holo'?: number,
  'low-holo'?: number,
  'trend-holo'?: number,
  'avg1-holo'?: number,
  'avg7-holo'?: number,
  'avg30-holo'?: number,
};

export default class Card extends BaseModel {
  uid!: UUID;
  id!: string; //min 1, max length 255
  name!: string; //min 1, max length 255
  setId!: string; //min 1, max length 255
  number!: string; //min 1, max length 255
  image!: string; //min 1, max length 255
  rarity!: string | null | undefined; //max length 255
  variants!: Variants;
  pricing!: {
    cardmarket: CardMarketPricing | null | undefined,
  };
  language!: string; //min 2, max length 15
  updatedAt!: Date;

  static new(uid: UUID, id: string, name: string, setId: string, number: string, image: string,
             rarity: string | null | undefined, variants: Variants,
             pricing: { cardmarket: CardMarketPricing | null | undefined }, language: string): Card {
    const ret = new Card();
    ret.uid = uid;
    ret.id = id;
    ret.name = name;
    ret.setId = setId;
    ret.number = number;
    ret.image = image;
    ret.rarity = rarity;
    ret.variants = variants;
    ret.pricing = pricing;
    ret.language = language;
    ret.updatedAt = new Date();
    return ret;
  }

  static override get tableName(): string {
    return 'cards';
  }

  static override get idColumn(): string {
    return 'uid';
  }

  static override get jsonSchemaWithReferences(): JSONSchema {
    return {
      $id: 'Card',
      type: 'object',
      required: ['uid', 'id', 'name', 'setId', 'number', 'image', 'variants', 'pricing', 'language', 'updatedAt'],

      properties: {
        uid: {type: 'string', format: 'uuid'},
        id: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        name: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        setId: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        number: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        image: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        rarity: {type: 'string', maxLength: 255}, //max length 255
        variants: {
          type: 'object',
          properties: {
            firstEdition: {type: 'boolean'},
            holo: {type: 'boolean'},
            normal: {type: 'boolean'},
            reverse: {type: 'boolean'},
            wPromo: {type: 'boolean'},
          },
        },
        pricing: {
          type: 'object',
          properties: {
            cardmarket: {
              type: 'object',
              properties: {
                updatedAt: {type: 'string', format: 'date-time'},
                unit: {type: 'string'},
                avg: {type: 'number'},
                low: {type: 'number'},
                trend: {type: 'number'},
                avg1: {type: 'number'},
                avg7: {type: 'number'},
                avg30: {type: 'number'},
                'avg-holo': {type: 'number'},
                'low-holo': {type: 'number'},
                'trend-holo': {type: 'number'},
                'avg1-holo': {type: 'number'},
                'avg7-holo': {type: 'number'},
                'avg30-holo': {type: 'number'},
              },
            },
          },
        },
        language: {type: 'string', minLength: 2, maxLength: 15}, //max length 255
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

  static override afterFind(args: StaticHookArguments<Card>): void {
    args.result.forEach((card: Card) => {
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