import TcgDexNetSet from './models/TcgDexNetSet';
import TcgDexNetSetBrief from './models/TcgDexNetSetBrief';
import Set from '../models/db/Set';
import {randomUUID} from 'crypto';
import {validateTcgDexNetApiResponse} from './util';

export function fetchSets(language: string): Promise<TcgDexNetSetBrief[] | undefined> {
  return fetch('https://api.tcgdex.net/v2/' + language + '/sets/')
    .then(res => validateTcgDexNetApiResponse(res))
    .then(res => res.json())
    .catch(e => console.error('Failed to fetch sets for language ' + language, e));
}

export function fetchSet(language: string, id: string): Promise<TcgDexNetSet | undefined> {
  return fetch('https://api.tcgdex.net/v2/' + language + '/sets/' + id)
    .then(res => validateTcgDexNetApiResponse(res))
    .then(res => res.json())
    .catch(e => console.error('Failed to fetch set ' + language + '/' + id, e));
}

export function mapTcgDexNetApiSet2Set(set: TcgDexNetSet, language: string): Set {
  return Set.new(randomUUID(), set.id, set.name, set.serie.id, set.logo ?? '', set.symbol ?? '', set.releaseDate, set.abbreviation?.official ?? '', language);
}