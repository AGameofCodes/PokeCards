import {Pinia, Store} from 'pinia-class-component';
import type {SetVmV1} from 'pokecards-oas';
import {ApiStore} from '@/stores/ApiStore';

@Store({
  id: 'SetsStore',
  name: 'SetsStore',
})
export class SetsStore extends Pinia {
  private get apiStore() {
    return new ApiStore();
  }

  //data
  private _loadingPromise: Promise<SetVmV1[]> | null = null;
  private _loadingSetsLanguageAndIds = new Set<string>();
  private _sets: SetVmV1[] = [];

  //getter
  get loading(): boolean {
    return this._loadingPromise !== null;
  }

  get sets(): SetVmV1[] {
    return this._sets;
  }

  get setsByUid(): Map<string, SetVmV1> {
    return new Map(this.sets.map(e => [e.uid, e]));
  }

  get setsByLanguageAndId(): Map<string, Map<string, SetVmV1>> {
    return new Map(
      Array.from(
        Map.groupBy(this.sets, e => e.language).entries(),
      ).map(([lang, sets]) => [lang, new Map(sets.map(s => [s.id, s]))]),
    );
  }

  //actions
  clear(): void {
    this._sets.splice(0);
  }

  setSets(sets: SetVmV1[]): void {
    this._sets.splice(0);
    this._sets.push(...sets);
  }

  addSet(set: SetVmV1): void {
    this._sets.push(set);
  }

  updateSet(set: SetVmV1): void {
    const index = this._sets.findIndex(e => e.id == set.id);
    if (index >= 0) {
      this._sets.splice(index, 1, set);
    } else {
      this._sets.push(set);
    }
  }

  forgetSet(set: SetVmV1): void {
    const index = this._sets.findIndex(e => e.id == set.id);
    if (index >= 0) {
      this._sets.splice(index, 1);
    }
  }

  async reloadSetByLanguageAndId(language: string, id: string): Promise<void> {
    const languageAndId = language + '_' + id;
    if (this._loadingSetsLanguageAndIds.has(languageAndId)) {
      return;
    }
    this._loadingSetsLanguageAndIds.add(languageAndId);

    try {
      const set = await this.apiStore.setApi.getByLanguageAndId(language, id);
      this.updateSet(set);
    } catch (e) {
      console.error(e);
    } finally {
      this._loadingSetsLanguageAndIds.delete(languageAndId);
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
      this._loadingPromise = this.apiStore.setApi.list();
      const sets = await this._loadingPromise;
      this.setSets(sets);
    } catch (err) {
      this.clear();
    } finally {
      this._loadingPromise = null;
    }
  }

  async loadIfAbsent(): Promise<void> {
    if (this._sets.length > 0) {
      return;
    }
    return await this.reload();
  }
}