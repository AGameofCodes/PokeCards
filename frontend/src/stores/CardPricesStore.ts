import {Pinia, Store} from 'pinia-class-component';
import {ApiStore} from '@/stores/ApiStore';
import {PriceVmV1} from 'pokecards-oas';

@Store({
  id: 'CardPricesStore',
  name: 'CardPricesStore',
})
export class CardPricesStore extends Pinia {
  private get apiStore() {
    return new ApiStore();
  }

  //data
  private _loadingPromise: Promise<PriceVmV1[]> | null = null;
  private _singleCardPriceLoadingPromises = new Map<string, Promise<void>>();
  private _cardPrices: PriceVmV1[] = [];

  //getter
  get loading(): boolean {
    return this._loadingPromise !== null;
  }

  get cardPrices(): PriceVmV1[] {
    return this._cardPrices;
  }

  get cardPricesById(): Map<string, PriceVmV1> {
    return new Map(this.cardPrices.map(e => [e.id, e]));
  }

  //actions
  clear(): void {
    this._cardPrices.splice(0);
  }

  setCardPrices(cardPrices: PriceVmV1[]): void {
    this._cardPrices.splice(0);
    this._cardPrices.push(...cardPrices);
  }

  rememberCardPrice(cardPrice: PriceVmV1): void {
    const index = this._cardPrices.findIndex(e => e.id === cardPrice.id);
    if (index >= 0) {
      this._cardPrices.splice(index, 1, cardPrice);
    } else {
      this._cardPrices.push(cardPrice);
    }
  }

  forgetCardPrice(cardPrice: PriceVmV1): void {
    const index = this._cardPrices.findIndex(e => e.id === cardPrice.id);
    if (index >= 0) {
      this._cardPrices.splice(index, 1);
    }
  }

  async reloadCardPriceById(id: string): Promise<void> {
    try {
      if (this._singleCardPriceLoadingPromises.has(id)) {
        await this._singleCardPriceLoadingPromises.get(id);
      } else {
        const future = this.apiStore.priceApi.getByCardId(id)
          .then(cardPrice => this.rememberCardPrice(cardPrice));
        this._singleCardPriceLoadingPromises.set(id, future);
        await future;
        this._singleCardPriceLoadingPromises.delete(id);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async reloadCardPricesByIds(ids: string[]): Promise<void> {
    try {
      const prices = await this.apiStore.priceApi.listForCards(ids)
      prices.forEach(cardPrice => this.rememberCardPrice(cardPrice));
    } catch (e) {
      console.error(e);
    }
  }

  // async reload(force: boolean = false): Promise<void> {
  //   if (this._loadingPromise) {
  //     await this._loadingPromise;
  //     if (!force) {// when force is true, wait for the current operation to complete, then reload
  //       return;
  //     }
  //   }
  //
  //   try {
  //     this._loadingPromise = this.apiStore.cardPriceApi.list();
  //     const cardPrices = await this._loadingPromise;
  //     this.setCardPrices(cardPrices);
  //   } catch (err) {
  //     this.clear();
  //   } finally {
  //     this._loadingPromise = null;
  //   }
  // }
  //
  // async loadIfAbsent(): Promise<void> {
  //   if (this._cardPrices.length > 0) {
  //     return;
  //   }
  //   return await this.reload();
  // }
}