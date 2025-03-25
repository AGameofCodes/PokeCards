import {Pinia, Store} from 'pinia-class-component';
import type {UserCardVmV1} from 'pokecards-oas';
import {ApiStore} from '@/stores/ApiStore';

@Store({
  id: 'UserCardsStore',
  name: 'UserCardsStore',
})
export class UserCardsStore extends Pinia {
  private get apiStore() {
    return new ApiStore();
  }

  //data
  private _loadingPromise: Promise<UserCardVmV1[]> | null = null;
  private _userCards: UserCardVmV1[] = [];

  //getter
  get loading(): boolean {
    return this._loadingPromise !== null;
  }

  get userCards(): UserCardVmV1[] {
    return this._userCards;
  }

  //actions
  clear(): void {
    this._userCards.splice(0);
  }

  setUserCards(cards: UserCardVmV1[]): void {
    this._userCards.splice(0);
    this._userCards.push(...cards);
  }

  addCard(card: UserCardVmV1): void {
    this._userCards.push(card);
  }

  updateCard(card: UserCardVmV1): void {
    const index = this._userCards.findIndex(e => e.id == card.id);
    if (index >= 0) {
      this._userCards.splice(index, 1, card);
    } else {
      this._userCards.push(card);
    }
  }

  forgetCard(card: UserCardVmV1): void {
    const index = this._userCards.findIndex(e => e.id == card.id);
    if (index >= 0) {
      this._userCards.splice(index, 1);
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
      this._loadingPromise = this.apiStore.userCardApi.list();
      const cards = await this._loadingPromise;
      this.setUserCards(cards);
    } catch (err) {
      this.clear();
    } finally {
      this._loadingPromise = null;
    }
  }

  async loadIfAbsent(): Promise<void> {
    if (this._userCards.length > 0) {
      return;
    }
    return await this.reload();
  }
}