import TcgApiSet from './models/TcgApiSet';
import TcgApiSetBrief from './models/TcgApiSetBrief';
import Set from '../models/db/Set';
import {randomUUID} from 'crypto';
import {validateTcpApiResponse} from './util';

export function fetchSets(language: string): Promise<TcgApiSetBrief[] | undefined> {
  return fetch('https://api.tcgdex.net/v2/' + language + '/sets/')
    .then(res => validateTcpApiResponse(res))
    .then(res => res.json())
    .catch(e => console.error('Failed to fetch sets for language ' + language, e));
}

export function fetchSet(language: string, id: string): Promise<TcgApiSet | undefined> {
  return fetch('https://api.tcgdex.net/v2/' + language + '/sets/' + id)
    .then(res => validateTcpApiResponse(res))
    .then(res => res.json())
    .catch(e => console.error('Failed to fetch set ' + language + '/' + id, e));
}

export function mapTcgApiSet2Set(set: TcgApiSet, language: string): Set {
  return Set.new(randomUUID(), set.id, set.name, set.serie.id, set.logo, set.symbol, set.releaseDate, set.abbreviation?.official ?? '', language);
}