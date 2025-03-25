import UserCard from '../models/db/UserCard';
import type {TransactionOrKnex} from 'objection';
import {UUID} from 'node:crypto';

export default class UserCardRepository {
  async getAll(createdBy: UUID, trx?: TransactionOrKnex): Promise<UserCard[]> {
    return UserCard.query(trx).where('createdBy', createdBy);
  }

  async getById(id: UUID, createdBy: UUID, trx?: TransactionOrKnex): Promise<UserCard | undefined> {
    return UserCard.query(trx).where('createdBy', createdBy).findById(id);
  }

  async add(userCard: UserCard, trx?: TransactionOrKnex): Promise<UserCard> {
    return UserCard.query(trx).insert(userCard);
  }

  async update(userCard: UserCard, trx?: TransactionOrKnex): Promise<boolean> {
    return await UserCard.query(trx).findById(userCard.id).update(userCard) === 1;
  }

  async remove(id: UUID, createdBy: UUID, trx?: TransactionOrKnex): Promise<boolean> {
    return await UserCard.query(trx).where('createdBy', createdBy).findById(id).delete() === 1;
  }
}