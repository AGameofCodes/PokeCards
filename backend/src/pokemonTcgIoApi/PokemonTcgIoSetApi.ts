import {validatePokemonTcgIoApiResponse} from './util';
import PokemonTcgIoSet from './models/PokemonTcgIoSet';

export function fetchSets(): Promise<PokemonTcgIoSet[] | undefined> {
  return fetch('https://api.pokemontcg.io/v2/sets/')
    .then(res => validatePokemonTcgIoApiResponse(res))
    .then(res => res.json())
    .then(res => res.data)
    .catch(e => console.error('Failed to fetch sets', e));
}