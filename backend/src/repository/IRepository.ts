import type BaseModel from '../models/db/BaseModel';
import type {TransactionOrKnex} from 'objection';

export default interface IRepository<T extends BaseModel> {
  getAll(trx?: TransactionOrKnex): Promise<T[]>;
  getById(id: string, trx?: TransactionOrKnex): Promise<T | undefined>;
  add(model: T, trx?: TransactionOrKnex): Promise<T>;
  update(model: T, trx?: TransactionOrKnex): Promise<boolean>;
  remove(id: string, trx?: TransactionOrKnex): Promise<boolean>;
}