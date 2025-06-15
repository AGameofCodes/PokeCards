import type IJob from './IJob';
import CardRepository from '../repository/CardRepository';
import * as pokemonTcgCardApi from '../pokemonTcgIoApi/PokemonTcgIoCardApi';
import CardPrice, {emptyCardMarket} from '../models/db/CardPrice';
import SetMappingRepository from '../repository/SetMappingRepository';
import CardPriceRepository from '../repository/CardPriceRepository';

export default class CardPricesUpdateJob implements IJob<void> {
  private cardPriceRepo: CardPriceRepository;
  private cardRepo: CardRepository;
  private mappingRepo: SetMappingRepository;
  private lock: boolean = false;
  private updatedCardPriceCount = 0;

  constructor() {
    this.cardPriceRepo = new CardPriceRepository();
    this.cardRepo = new CardRepository();
    this.mappingRepo = new SetMappingRepository();
  }

  get scheduleAtStartup(): boolean {
    return true;
  }

  get schedule(): Date | string {
    return '0 0 0 * * *'; //every day
  }

  async execute(): Promise<void> {
    if (this.lock) {
      return;
    }
    this.lock = true;
    this.updatedCardPriceCount = 0;
    try {
      await this.updateCardPrices();
    } finally {
      console.log('Updated ' + this.updatedCardPriceCount + ' prices');
      this.lock = false;
    }
  }

  private async updateCardPrices(): Promise<void> {
    const cards = await this.cardRepo.getAll();
    const cardIds = [...new Set(cards.map(e => e.id))];

    for (let cardId of cardIds) {
      await new Promise((resolve) => setTimeout(resolve, 500)); //sleep 500ms before next api request

      const idSplit = cardId.split('-');
      const tcgDexNetSetId = idSplit.slice(0, idSplit.length - 1).join('-');
      const setMapping = await this.mappingRepo.getByTcgDexNetId(tcgDexNetSetId);
      if (!setMapping) {
        continue;
      }

      const pokemonTcgIoId = setMapping.pokemonTcgIoId + '-' + parseInt(idSplit[idSplit.length - 1]!);
      const apiCard = await pokemonTcgCardApi.fetchCard(pokemonTcgIoId);
      if (apiCard !== undefined) {
        const prices = CardPrice.new(cardId, apiCard.cardmarket ?? emptyCardMarket());
        await this.cardPriceRepo.update(prices);
        this.updatedCardPriceCount++;
      }
    }
  }
}