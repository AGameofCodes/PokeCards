import type IJob from './IJob';
import SetRepository from '../repository/SetRepository';
import {fetchSet, fetchSets, mapTcgDexNetApiSet2Set} from '../tcgDexNetApi/TcgApiSetApi';

export default class SetsUpdateJob implements IJob<void> {
  private repo: SetRepository;
  private lock: boolean = false;

  constructor() {
    this.repo = new SetRepository();
  }

  get scheduleAtStartup(): boolean {
    return true;
  }

  get schedule(): Date | string {
    return '0 0 * * * *'; //every hour
  }

  async execute(): Promise<void> {
    if (this.lock) {
      return;
    }
    this.lock = true;
    try {
      await this.executeForAllLanguages();
    } finally {
      this.lock = false;
    }
  }

  private async executeForAllLanguages(): Promise<void> {
    for (let language of ['en', 'de']) {
      await this.executeForLanguage(language);
    }
  }

  private async executeForLanguage(language: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000)); //sleep 3000ms before next api request

    const apiSetBriefs = await fetchSets(language);
    if (!apiSetBriefs) {
      return;
    }

    for (let apiSetBrief of apiSetBriefs) {
      let set = await this.repo.getByLanguageAndId(language, apiSetBrief.id);

      //add missing set
      if (!set) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); //sleep 3000ms before next api request

        const apiSet = await fetchSet(language, apiSetBrief.id);
        if (apiSet) {
          set = mapTcgDexNetApiSet2Set(apiSet, language);
          await this.repo.add(set);
        }
      }
    }
  }
}