import CardPrice from '../models/db/CardPrice';
import type {TransactionOrKnex} from 'objection';

export default class CardPriceRepository {
  async getAll(trx?: TransactionOrKnex): Promise<CardPrice[]> {
    return CardPrice.query(trx);
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