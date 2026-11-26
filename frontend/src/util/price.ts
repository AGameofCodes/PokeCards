import {CardVmV1, UserCardVmV1} from 'pokecards-oas';

export function findPrice(card: CardVmV1, variant: string | undefined): number | null {
  if (!variant) {
    return null;
  }

  variant = variant.toLowerCase();

  let pricing = card.pricing;
  const detailedVariant = card.variantsDetailed.filter(e => e.variantId === variant);
  if (detailedVariant.length === 1) {
    pricing = detailedVariant[0]!.pricing;
    variant = detailedVariant[0]!.type.toLocaleLowerCase();
  }

  const isReverse = variant.includes('reverse');
  const isHolo = variant.includes('holo');
  const isNormal = variant.includes('normal');

  if (isReverse) {
    return pricing?.cardmarket?.avg30Holo ?? null;
  } else if (isHolo || isNormal) {
    return pricing?.cardmarket?.avg30 ?? null;
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