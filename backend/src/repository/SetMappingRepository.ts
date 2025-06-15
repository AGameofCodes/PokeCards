import SetMapping from '../models/db/SetMapping';
import type {TransactionOrKnex} from 'objection';

export default class SetMappingRepository {
  async getAll(trx?: TransactionOrKnex): Promise<SetMapping[]> {
    return SetMapping.query(trx);
  }

  async getByTcgDexNetId(id: string, trx?: TransactionOrKnex): Promise<SetMapping | undefined> {
    return SetMapping.query(trx).where('tcgDexNetId', id).first();
  }

  async getByPokemonTcgIoId(id: string, trx?: TransactionOrKnex): Promise<SetMapping | undefined> {
    return SetMapping.query(trx).where('pokemonTcgIoId', id).first();
  }

  async add(setMapping: SetMapping, trx?: TransactionOrKnex): Promise<SetMapping> {
    return SetMapping.query(trx).insert(setMapping);
  }

  // async update(setMapping: SetMapping, trx?: TransactionOrKnex): Promise<boolean> {
  //   return await SetMapping.query(trx).where('uid', setMapping.uid).update(setMapping) === 1;
  // }

  // async remove(uid: string, trx?: TransactionOrKnex): Promise<boolean> {
  //   return await SetMapping.query(trx).where('uid', uid).delete() === 1;
  // }
}