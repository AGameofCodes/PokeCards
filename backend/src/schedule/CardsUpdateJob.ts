import type IJob from './IJob';
import CardRepository from '../repository/CardRepository';
import {fetchCard, mapApiTcgDexNetCard2Card} from '../tcgDexNetApi/TcgApiCardApi';

export default class CardsUpdateJob implements IJob<void> {
  private repo: CardRepository;
  private lock: boolean = false;
  private updatedCardCount = 0;

  constructor() {
    this.repo = new CardRepository();
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
    this.updatedCardCount = 0;
    try {
      await this.updateCards();
    } finally {
      console.log('Updated ' + this.updatedCardCount + ' cards');
      this.lock = false;
    }
  }

  private async updateCards(): Promise<void> {
    const cards = await this.repo.getAll();

    for (let card of cards) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); //sleep 500ms before next api request

      const apiCard = await fetchCard(card.language, card.id);
      if (apiCard) {
        const updatedCard = mapApiTcgDexNetCard2Card(apiCard, card.language);
        updatedCard.uid = card.uid;
        await this.repo.update(updatedCard);
        this.updatedCardCount++;
      }
    }
  }
}