import type {JSONSchema, ModelOptions, Pojo, StaticHookArguments} from 'objection';
import {UUID} from 'node:crypto';
import BaseModel from './BaseModel';

export default class Set extends BaseModel {
  uid!: UUID;
  id!: string; //min 1, max length 255
  name!: string; //min 1, max length 255
  serieId!: string; //min 1, max length 255
  logo!: string; //min 1, max length 255
  symbol!: string; //min 1, max length 255
  releaseDate!: string; //length 10 // e.g. '2020-08-14',
  abbreviation!: string; //min 1, max length 255
  language!: string; //min 2, max length 15
  updatedAt!: Date;

  static new(uid: UUID, id: string, name: string, serieId: string, logo: string, symbol: string,
             releaseDate: string, abbreviation: string, language: string): Set {
    const ret = new Set();
    ret.uid = uid;
    ret.id = id;
    ret.name = name;
    ret.serieId = serieId;
    ret.logo = logo;
    ret.symbol = symbol;
    ret.releaseDate = releaseDate;
    ret.abbreviation = abbreviation;
    ret.language = language;
    ret.updatedAt = new Date();
    return ret;
  }

  static override get tableName(): string {
    return 'sets';
  }

  static override get idColumn(): string {
    return 'uid';
  }

  static override get jsonSchemaWithReferences(): JSONSchema {
    return {
      $id: 'Set',
      type: 'object',
      required: ['uid', 'id', 'name', 'serieId', 'logo', 'symbol', 'releaseDate', 'abbreviation', 'language', 'updatedAt'],

      properties: {
        uid: {type: 'string', format: 'uuid'},
        id: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        name: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        serieId: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        logo: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        symbol: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        releaseDate: {type: 'string', format: 'date'},
        abbreviation: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
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

  static override afterFind(args: StaticHookArguments<Set>): void {
    args.result.forEach((card: Set) => {
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