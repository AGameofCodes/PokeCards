import TcgApiCardBrief from './TcgApiCardBrief';

export default interface TcgApiSet {
  id: string;
  name: string;
  logo: string | undefined;
  symbol: string | undefined;
  cardCount: {
    firstEd: number,
    holo: number,
    normal: number,
    official: number,
    reverse: number,
    total: number,
  };
  cards: TcgApiCardBrief[],
  releaseDate: string; // e.g. '2020-08-14',
  serie: {
    id: string,
    name: string
  };
  abbreviation?: {
    official?: string,
  }
}