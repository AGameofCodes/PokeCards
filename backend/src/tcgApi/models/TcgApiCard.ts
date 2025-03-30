import TcgApiSetBrief from './TcgApiSetBrief';

export default interface TcgApiCard {
  id: string;
  localId: string;
  name: string;
  image: string | null | undefined;
  category: 'Pokemon' | 'Energy' | 'Trainer',
  illustrator: string | null | undefined,
  rarity: 'Uncommon' | null | undefined,
  set: TcgApiSetBrief,
  variants: {
    firstEdition?: boolean,
    holo?: boolean,
    normal?: boolean,
    reverse?: boolean,
    wPromo?: boolean
  }
}