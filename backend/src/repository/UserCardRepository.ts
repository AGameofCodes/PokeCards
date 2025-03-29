import UserCard from '../models/db/UserCard';
import type {TransactionOrKnex} from 'objection';
import {UUID} from 'node:crypto';
import {randomUUID} from 'crypto';
import UserCardLabel from '../models/db/UserCardLabel';

export default class UserCardRepository {
  async getAll(createdBy: UUID, trx?: TransactionOrKnex): Promise<UserCard[]> {
    return UserCard.query(trx).where('createdBy', createdBy).withGraphFetched('labels');
  }

  async getById(id: UUID, createdBy: UUID, trx?: TransactionOrKnex): Promise<UserCard | undefined> {
    return UserCard.query(trx).where('createdBy', createdBy).withGraphFetched('labels').findById(id);
  }

  async add(userCard: UserCard, trx?: TransactionOrKnex): Promise<UserCard> {
    return await UserCard.transaction(trx!, async trx => {
      const insertedUserCard = await UserCard.query(trx).insert(userCard);
      for (let i = 0; i < userCard.labels.length; i++) {
        userCard.labels[i]!.id = randomUUID();
        userCard.labels[i]!.userCardId = insertedUserCard.id;
        await UserCardLabel.query(trx).insert(userCard.labels[i]!);
      }
      return (await this.getById(insertedUserCard.id, insertedUserCard.createdBy, trx))!;
    });
  }

  async update(userCard: UserCard, trx?: TransactionOrKnex): Promise<UserCard> {
    return await UserCard.transaction(trx!, async trx => {
      const updatedCount = await UserCard.query(trx).where('createdBy', userCard.createdBy).findById(userCard.id).update(userCard);
      if (updatedCount !== 1) {
        throw new Error('Update failed');
      }
      for (let i = 0; i < userCard.labels.length; i++) {
        const uc = userCard.labels[i]!;
        uc.userCardId = userCard.id;
        if (uc.id === '00000000-0000-0000-0000-000000000000') {
          uc.id = randomUUID();
          userCard.labels[i] = await UserCardLabel.query(trx).insert(uc);
        } else {
          if (await UserCardLabel.query(trx).findById(uc.id).update(uc) !== 1) {
            throw new Error('Update failed');
          }
        }
        await UserCardLabel.query(trx)
          .where('userCardId', userCard.id)
          .whereNotIn('id', userCard.labels.map(e => e.id))
          .delete();
      }
      return (await this.getById(userCard.id, userCard.createdBy, trx))!;
    });
  }

  async remove(id: UUID, createdBy: UUID, trx?: TransactionOrKnex): Promise<boolean> {
    return await UserCard.query(trx).where('createdBy', createdBy).findById(id).delete() === 1;
  }
}