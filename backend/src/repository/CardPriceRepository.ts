import CardPrice from '../models/db/CardPrice';
import {QueryBuilder, TransactionOrKnex} from 'objection';

export default class CardPriceRepository {
  async getAll(trx?: TransactionOrKnex,
               filters?: ((query: QueryBuilder<CardPrice, CardPrice[]>) => QueryBuilder<CardPrice, CardPrice[]>)[],
  ): Promise<CardPrice[]> {
    let q = CardPrice.query(trx);
    if (filters) {
      filters.forEach((filter) => {
        q = filter(q);
      });
    }
    return q;
  }

  async getById(id: string, trx?: TransactionOrKnex): Promise<CardPrice | undefined> {
    return CardPrice.query(trx).where('id', id).first();
  }

  async add(cardPrice: CardPrice, trx?: TransactionOrKnex): Promise<CardPrice> {
    return CardPrice.query(trx).insert(cardPrice);
  }

  async update(cardPrice: CardPrice, trx?: TransactionOrKnex): Promise<boolean> {
    return await CardPrice.query(trx).where('id', cardPrice.id).update(cardPrice) === 1;
  }

  async remove(id: string, trx?: TransactionOrKnex): Promise<boolean> {
    return await CardPrice.query(trx).where('id', id).delete() === 1;
  }
}