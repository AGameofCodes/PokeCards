import Set from '../models/db/Set';
import type {TransactionOrKnex} from 'objection';
import {UUID} from '../models/api/uuid';

export default class SetRepository {
  async getAll(trx?: TransactionOrKnex): Promise<Set[]> {
    return Set.query(trx);
  }

  async getByUid(uid: UUID, trx?: TransactionOrKnex): Promise<Set | undefined> {
    return Set.query(trx).where('uid', uid).first();
  }

  async getByLanguageAndId(language: string, id: string, trx?: TransactionOrKnex): Promise<Set | undefined> {
    return Set.query(trx).where('language', language).where('id', id).first();
  }

  async add(set: Set, trx?: TransactionOrKnex): Promise<Set> {
    return Set.query(trx).insert(set);
  }

  async update(set: Set, trx?: TransactionOrKnex): Promise<boolean> {
    return await Set.query(trx).where('uid', set.uid).update(set) === 1;
  }

  async remove(uid: string, trx?: TransactionOrKnex): Promise<boolean> {
    return await Set.query(trx).where('uid', uid).delete() === 1;
  }
}