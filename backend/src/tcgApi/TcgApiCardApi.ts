import TcgApiCard from './models/TcgApiCard';
import TcgApiCardBrief from './models/TcgApiCardBrief';
import Card from '../models/db/Card';
import {randomUUID} from 'crypto';
import {CardBriefVmV1} from '../controllers/api/v1/CardController';
import {validateTcpApiResponse} from './util';

export function fetchCards(language: string, filter: string[]): Promise<CardBriefVmV1[] | undefined> {
  const filterQuery = filter.join('&');
  return fetch('https://api.tcgdex.net/v2/' + language + '/cards?' + filterQuery)
    .then(res => validateTcpApiResponse(res))
    .then(res => res.json())
    .then(res => res.map((e: TcgApiCardBrief) => mapTcgApiCardBrief2CardBriefVmV1(e, language)))
    .catch(e => console.error('Failed to search card with filters ' + filter.toString(), e));
}

export function fetchCard(language: string, id: string): Promise<TcgApiCard | undefined> {
  return fetch('https://api.tcgdex.net/v2/' + language + '/cards/' + id)
    .then(res => validateTcpApiResponse(res))
    .then(res => res.json())
    .catch(e => console.error('Failed to fetch card ' + language + '/' + id, e));
}

export function mapTcgApiCardBrief2CardBriefVmV1(brief: TcgApiCardBrief, language: string): CardBriefVmV1 {
  return {
    id: brief.id,
    name: brief.name,
    image: brief.image,
    language: language,
  };
}

export function mapApiTcgCard2Card(card: TcgApiCard, language: string): Card {
  return Card.new(randomUUID(), card.id, card.name, card.set.id, card.localId, card.image ?? '', card.rarity, card.variants, language);
}
