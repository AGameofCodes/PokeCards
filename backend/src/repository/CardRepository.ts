import Card from '../models/db/Card';
import {QueryBuilder, TransactionOrKnex} from 'objection';
import {UUID} from '../models/api/uuid';

export default class CardRepository {
  async getAll(trx?: TransactionOrKnex,
               filters?: ((query: QueryBuilder<Card, Card[]>) => QueryBuilder<Card, Card[]>)[],
  ): Promise<Card[]> {
    let q = Card.query(trx);
    if (filters) {
      filters.forEach((filter) => {
        q = filter(q);
      });
    }
    return q;
  }

  async getByUid(uid: UUID, trx?: TransactionOrKnex): Promise<Card | undefined> {
    return Card.query(trx).where('uid', uid).first();
  }

  async getByLanguageAndId(language: string, id: string, trx?: TransactionOrKnex): Promise<Card | undefined> {
    return Card.query(trx).where('language', language).where('id', id).first();
  }

  async add(card: Card, trx?: TransactionOrKnex): Promise<Card> {
    return Card.query(trx).insert(card);
  }

  async update(card: Card, trx?: TransactionOrKnex): Promise<boolean> {
    return await Card.query(trx).where('uid', card.uid).update(card) === 1;
  }

  async remove(uid: string, trx?: TransactionOrKnex): Promise<boolean> {
    return await Card.query(trx).where('uid', uid).delete() === 1;
  }
}