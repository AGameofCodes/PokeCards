import User from '../models/db/User';
import type {TransactionOrKnex} from 'objection';
import {UUID} from 'node:crypto';

export default class UserRepository {
  async getAll(trx?: TransactionOrKnex): Promise<User[]> {
    return User.query(trx);
  }

  async getById(id: UUID, trx?: TransactionOrKnex): Promise<User | undefined> {
    return User.query(trx).findById(id);
  }

  async getByName(name: string, trx?: TransactionOrKnex): Promise<User | undefined> {
    return User.query(trx).where('name', name).first();
  }

  async add(user: User, trx?: TransactionOrKnex): Promise<User> {
    return User.query(trx).insert(user);
  }

  async update(user: User, trx?: TransactionOrKnex): Promise<boolean> {
    return await User.query(trx).findById(user.id).update(user) === 1;
  }

  async remove(id: UUID, trx?: TransactionOrKnex): Promise<boolean> {
    return await User.query(trx).findById(id).delete() === 1;
  }
}