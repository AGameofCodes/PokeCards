import type IJob from './IJob';
import SetRepository from '../repository/SetRepository';
import {fetchSets} from '../pokemonTcgIoApi/PokemonTcgIoSetApi';
import SetMappingRepository from '../repository/SetMappingRepository';
import SetMapping from '../models/db/SetMapping';

export default class SetMappingUpdateJob implements IJob<void> {
  private setRepo: SetRepository;
  private mappingRepo: SetMappingRepository;
  private lock: boolean = false;

  constructor() {
    this.setRepo = new SetRepository();
    this.mappingRepo = new SetMappingRepository();
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
      await this.updateMappings();
    } finally {
      this.lock = false;
    }
  }

  private async updateMappings(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000)); //sleep 3000ms before next api request

    const apiSets = await fetchSets();
    if (!apiSets) {
      return;
    }

    const tcgDexSets = (await this.setRepo.getAll()).filter(e => e.language === 'en');

    for (let apiSet of apiSets) {
      let set = await this.mappingRepo.getByPokemonTcgIoId(apiSet.id);

      //add missing set
      if (!set) {
        let matchedId: string | undefined = undefined;

        const matchers = [
          //direct id match
          () => tcgDexSets
            .find(tcgDexSet => tcgDexSet.id.toLowerCase() === apiSet.id.toLowerCase())?.id,

          //id match without leading zeros
          () => tcgDexSets
            .find(tcgDexSet => this.stripLeadingZeros(tcgDexSet.id).toLowerCase() === apiSet.id.toLowerCase())?.id,

          //replace '.' with 'pt'
          () => tcgDexSets
            .find(tcgDexSet => tcgDexSet.id.toLowerCase().replaceAll('.', 'pt') === apiSet.id.toLowerCase())?.id,

          //find via set codes/abbreviation/ids
          () => {
            //in pokemonTcgIo the code do not seem to be unique
            const codeOccurrences = apiSets
              .map(e => e.ptcgoCode?.toLowerCase())
              .filter(e => !!e)
              .filter(e => e === apiSet.ptcgoCode?.toLowerCase())
              .length;
            if (codeOccurrences > 1) {
              return undefined;
            }

            const abbreviationOccurrences = tcgDexSets
              .map(e => e.abbreviation.toLowerCase())
              .filter(e => !!e)
              .filter(e => e === apiSet.ptcgoCode?.toLowerCase())
              .length;

            if (abbreviationOccurrences > 1) {
              return undefined;
            }

            return tcgDexSets
              .find(tcgDexSet =>
                tcgDexSet.abbreviation.toLowerCase() === apiSet.ptcgoCode?.toLowerCase()
                || tcgDexSet.abbreviation.toLowerCase() === apiSet.id?.toLowerCase()
                || tcgDexSet.id.toLowerCase() === apiSet.ptcgoCode?.toLowerCase())?.id
          },
        ];

        for (const matcher of matchers) {
          if (!matchedId) {
            matchedId = matcher();
          } else {
            break;
          }
        }

        if (!matchedId) {
          console.log('No matching set found for', JSON.stringify(apiSet));
          continue;
        }

        const mapping = SetMapping.new(matchedId, apiSet.id);
        await this.mappingRepo.add(mapping);
      }
    }
  }

  private stripLeadingZeros(str: string): string {
    return str.match(/([a-zA-Z]+)|(\d+)|[.-]/g)! //split into tokens
      .map((part) => {
        if (part.match(/\d+/)) {
          return '' + parseInt(part); //strip leading zeros
        }
        return part;
      }).join('');
  }
}