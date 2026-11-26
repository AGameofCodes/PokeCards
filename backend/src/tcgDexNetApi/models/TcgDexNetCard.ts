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
  },
  variants_detailed?: {
    type: 'firstEdition' | 'holo' | 'normal' | 'reverse' | 'wPromo',
    size: 'standard' | 'jumbo',
    foil?: string,
    stamp?: string[],
    thirdParty: {
      cardmarket: number | undefined,
    },
    variantId: string,
    pricing: {
      cardmarket: {
        updatedAt: string,
        unit: string,
        idProduct: number,
        avg?: number,
        low?: number,
        trend?: number,
        avg1?: number,
        avg7?: number,
        avg30?: number,
        'avg-holo'?: number,
        'low-holo'?: number,
        'trend-holo'?: number,
        'avg1-holo'?: number,
        'avg7-holo'?: number,
        'avg30-holo'?: number,
      } | undefined,
    },
  }[]
  pricing: {
    cardmarket: {
      updatedAt: string;
      unit: string,
      idProduct: number,
      avg?: number,
      low?: number,
      trend?: number,
      avg1?: number,
      avg7?: number,
      avg30?: number,
      'avg-holo'?: number,
      'low-holo'?: number,
      'trend-holo'?: number,
      'avg1-holo'?: number,
      'avg7-holo'?: number,
      'avg30-holo'?: number,
    }
  }
}