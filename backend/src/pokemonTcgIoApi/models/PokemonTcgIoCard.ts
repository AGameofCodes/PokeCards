export default interface PokemonTcgIoCard {
  id: string;
  cardmarket?: {
    url: string,
    updatedAt: string; //e.g. 2021/08/04,
    prices: {
      averageSellPrice: number | null | undefined,
      lowPrice: number | null | undefined,
      trendPrice: number | null | undefined,
      germanProLow: number | null | undefined,
      suggestedPrice: number | null | undefined,
      reverseHoloSell: number | null | undefined,
      reverseHoloLow: number | null | undefined,
      reverseHoloTrend: number | null | undefined,
      lowPriceExPlus: number | null | undefined,
      avg1: number | null | undefined,
      avg7: number | null | undefined,
      avg30: number | null | undefined,
      reverseHoloAvg1: number | null | undefined,
      reverseHoloAvg7: number | null | undefined,
      reverseHoloAvg30: number | null | undefined,
    }
  };
}