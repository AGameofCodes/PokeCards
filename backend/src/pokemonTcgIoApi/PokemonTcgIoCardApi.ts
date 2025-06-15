import {validatePokemonTcgIoApiResponse} from './util';
import PokemonTcgIoCard from './models/PokemonTcgIoCard';
import {getHeaders} from './auth';


export function fetchCard(id: string): Promise<PokemonTcgIoCard | undefined> {
  return fetch('https://api.pokemontcg.io/v2/cards/' + id, {headers: getHeaders()})
    .then(res => validatePokemonTcgIoApiResponse(res))
    .then(res => res.json())
    .then(res => res.data)
    .catch(e => console.error('Failed to fetch card ' + id, e));
}

// export function mapApiTcgCard2Card(card: TcgApiCard, language: string): Card {
//   return Card.new(randomUUID(), card.id, card.name, card.set.id, card.localId, card.image ?? '', card.rarity, card.variants, language);
// }
