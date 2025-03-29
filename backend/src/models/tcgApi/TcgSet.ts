import TcgCardBrief from './TcgCardBrief';

export default interface TcgSet {
  id: string;
  name: string;
  logo: string;
  symbol: string;
  cardCount: {
    firstEd: number,
    holo: number,
    normal: number,
    official: number,
    reverse: number,
    total: number,
  };
  cards: TcgCardBrief[],
  releaseDate: string; // e.g. '2020-08-14',
  serie: {
    id: string,
    name: string
  };
  abbreviation?: {
    official?: string,
  }
}