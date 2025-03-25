import Card from '../models/db/Card';
import type {TransactionOrKnex} from 'objection';
import {UUID} from '../models/api/uuid';

export default class CardRepository {
  async getAll(trx?: TransactionOrKnex): Promise<Card[]> {
    return Card.query(trx);
  }

  async getByUid(uid: UUID, trx?: TransactionOrKnex): Promise<Card | undefined> {
    return Card.query(trx).findById(uid);
  }

  async getByLanguageAndId(language: string, id: string, trx?: TransactionOrKnex): Promise<Card | undefined> {
    return Card.query(trx).where('language', language).where('id', id).first();
  }

  async add(card: Card, trx?: TransactionOrKnex): Promise<Card> {
    return Card.query(trx).insert(card);
  }

  async update(card: Card, trx?: TransactionOrKnex): Promise<boolean> {
    return await Card.query(trx).findById(card.id).update(card) === 1;
  }

  async remove(id: string, trx?: TransactionOrKnex): Promise<boolean> {
    return await Card.query(trx).findById(id).delete() === 1;
  }
}