import TcgSetBrief from './TcgSetBrief';

export default interface TcgCard {
  id: string;
  localId: string;
  name: string;
  image: string | null | undefined;
  category: 'Pokemon' | 'Energy' | 'Trainer',
  illustrator: string | null | undefined,
  rarity: 'Uncommon' | null | undefined,
  set: TcgSetBrief,
  variants: {
    firstEdition?: boolean,
    holo?: boolean,
    normal?: boolean,
    reverse?: boolean,
    wPromo?: boolean
  }
}