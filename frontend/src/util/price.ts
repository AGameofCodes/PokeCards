import type {PriceVmV1} from 'pokecards-oas';

export function findPrice(price: PriceVmV1, variant: string | undefined): number | null {
  if (!variant) {
    return null;
  }

  variant = variant.toLowerCase();
  const isReverse = variant.includes('reverse');
  const isHolo = variant.includes('holo');
  const isNormal = variant.includes('normal');

  if (isReverse) {
    return price.cardmarket.prices.reverseHoloTrend ?? null;
  } else if (isHolo || isNormal) {
    return price.cardmarket.prices.trendPrice ?? null;
  } else {
    return null;
  }
}

export function formatPrice(price: number, locale: string): string {
  const opts = {minimumFractionDigits: 2, maximumFractionDigits: 2};
  return price.toLocaleString(locale, opts) + '€';
}