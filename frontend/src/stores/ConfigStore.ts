import {Pinia, Store} from 'pinia-class-component';
import {ConfigVmV1} from 'pokecards-oas';
import {ApiStore} from '@/stores/ApiStore';

@Store({
  id: 'ConfigStore',
  name: 'ConfigStore',
})
export class ConfigStore extends Pinia {
  private get apiStore() {
    return new ApiStore();
  }

  //data
  private _loadedOnce: boolean = false;
  private _loadingPromise: Promise<ConfigVmV1> | null = null;
  private _config: ConfigVmV1 | null = null;

  //getter
  get loading(): boolean {
    return this._loadingPromise !== null;
  }

  get config(): ConfigVmV1 | null {
    return this._config;
  }

  //actions
  clear() {
    this._config = null;
  }

  setConfig(config: ConfigVmV1) {
    this._config = config;
    this._session = session;
  }

  async reload(force: boolean = false) {
    if (this._loadingPromise) {
      await this._loadingPromise.catch(_ => {});
      if (!force) {// when force is true, wait for the current operation to complete, then reload
        return;
      }
    }

    try {
      this._loadingPromise = this.apiStore.configApi.getConfig();
      const res = await this._loadingPromise;
      this._config = res ?? null;
    } catch (err) {
      this.clear();
    } finally {
      this._loadingPromise = null;
      this._loadedOnce = true;
    }
  }

  async loadIfAbsent(): Promise<void> {
    if (this._loadedOnce) {
      return;
    }
    return await this.reload();
  }
}