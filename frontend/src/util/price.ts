import {CardVmV1, UserCardVmV1} from 'pokecards-oas';

export function findPrice(card: CardVmV1, variant: string | undefined): number | null {
  if (!variant) {
    return null;
  }

  variant = variant.toLowerCase();
  const isReverse = variant.includes('reverse');
  const isHolo = variant.includes('holo');
  const isNormal = variant.includes('normal');

  if (isReverse) {
    return card.pricing.cardmarket?.trendHolo ?? null;
  } else if (isHolo || isNormal) {
    return card.pricing.cardmarket?.trend ?? null;
  } else {
    return null;
  }
}

export function formatPrice(price: number, locale: string): string {
  const opts = {minimumFractionDigits: 2, maximumFractionDigits: 2};
  return price.toLocaleString(locale, opts) + '€';
}

export function isCardPriceIgnoredInTotalValue(userCard: UserCardVmV1): boolean {
  return userCard.labels.some(e => !!e.value);
}