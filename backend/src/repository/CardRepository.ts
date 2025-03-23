import Card from '../models/db/Card';
import type {TransactionOrKnex} from 'objection';
import {UUID} from 'node:crypto';

export default class CardRepository {
  async getAll(createdBy: UUID, trx?: TransactionOrKnex): Promise<Card[]> {
    return Card.query(trx).where('createdBy', createdBy);
  }

  async getById(id: UUID, createdBy: UUID, trx?: TransactionOrKnex): Promise<Card | undefined> {
    return Card.query(trx).where('createdBy', createdBy).findById(id);
  }

  async add(label: Card, trx?: TransactionOrKnex): Promise<Card> {
    return Card.query(trx).insert(label);
  }

  async update(label: Card, trx?: TransactionOrKnex): Promise<boolean> {
    return await Card.query(trx).findById(label.id).update(label) === 1;
  }

  async remove(id: UUID, createdBy: UUID, trx?: TransactionOrKnex): Promise<boolean> {
    return await Card.query(trx).where('createdBy', createdBy).findById(id).delete() === 1;
  }
}