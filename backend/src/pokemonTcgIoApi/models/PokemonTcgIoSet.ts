export default interface PokemonTcgIoSet {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  legalities: unknown;
  ptcgoCode?: string | undefined;
  releaseDate: string,
  updatedAt: string,
  images: {
    symbol: string,
    logo: string,
  };
}