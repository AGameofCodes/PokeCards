import {Pinia, Store} from 'pinia-class-component';
import type {CardVmV1} from 'pokecards-oas';
import {ApiStore} from '@/stores/ApiStore';

@Store({
  id: 'CardsStore',
  name: 'CardsStore',
})
export class CardsStore extends Pinia {
  private get apiStore() {
    return new ApiStore();
  }

  //data
  private _loadingPromise: Promise<CardVmV1[]> | null = null;
  private _cards: CardVmV1[] = [];

  //getter
  get loading(): boolean {
    return this._loadingPromise !== null;
  }

  get cards(): CardVmV1[] {
    return this._cards;
  }

  //actions
  clear(): void {
    this._cards.splice(0);
  }

  setCards(cards: CardVmV1[]): void {
    this._cards.splice(0);
    this._cards.push(...cards);
  }

  addCard(card: CardVmV1): void {
    this._cards.push(card);
  }

  updateCard(card: CardVmV1): void {
    const index = this._cards.findIndex(e => e.id == card.id);
    if (index >= 0) {
      this._cards.splice(index, 1, card);
    } else {
      this._cards.push(card);
    }
  }

  forgetCard(card: CardVmV1): void {
    const index = this._cards.findIndex(e => e.id == card.id);
    if (index >= 0) {
      this._cards.splice(index, 1);
    }
  }

  async reload(force: boolean = false): Promise<void> {
    if (this._loadingPromise) {
      await this._loadingPromise;
      if (!force) {// when force is true, wait for the current operation to complete, then reload
        return;
      }
    }

    try {
      this._loadingPromise = this.apiStore.cardApi.list();
      const cards = await this._loadingPromise;
      this.setCards(cards);
    } catch (err) {
      this.clear();
    } finally {
      this._loadingPromise = null;
    }
  }

  async loadIfAbsent(): Promise<void> {
    if (this._cards.length > 0) {
      return;
    }
    return await this.reload();
  }
}