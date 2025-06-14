import TcgDexNetSetBrief from './TcgDexNetSetBrief';

export default interface TcgDexNetCard {
  id: string;
  localId: string;
  name: string;
  image: string | null | undefined;
  category: 'Pokemon' | 'Energy' | 'Trainer',
  illustrator: string | null | undefined,
  rarity: 'Uncommon' | null | undefined,
  set: TcgDexNetSetBrief,
  variants: {
    firstEdition?: boolean,
    holo?: boolean,
    normal?: boolean,
    reverse?: boolean,
    wPromo?: boolean
  }
}