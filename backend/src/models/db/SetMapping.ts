import type {JSONSchema, ModelOptions, Pojo, StaticHookArguments} from 'objection';
import BaseModel from './BaseModel';

export default class SetMapping extends BaseModel {
  tcgDexNetId!: string; //min 1, max length 255
  pokemonTcgIoId!: string; //min 1, max length 255
  updatedAt!: Date;

  static new(tcgDexNetId: string, pokemonTcgIoId: string): SetMapping {
    const ret = new SetMapping();
    ret.tcgDexNetId = tcgDexNetId;
    ret.pokemonTcgIoId = pokemonTcgIoId;
    ret.updatedAt = new Date();
    return ret;
  }

  static override get tableName(): string {
    return 'setMappings';
  }

  static override get jsonSchemaWithReferences(): JSONSchema {
    return {
      $id: 'SetMapping',
      type: 'object',
      required: ['tcgDexNetId', 'pokemonTcgIoId', 'updatedAt'],

      properties: {
        tcgDexNetId: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
        pokemonTcgIoId: {type: 'string', minLength: 1, maxLength: 255}, //max length 255
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

  static override afterFind(args: StaticHookArguments<SetMapping>): void {
    args.result.forEach((card: SetMapping) => {
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