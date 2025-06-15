import {UserCardVmV1} from 'pokecards-oas';
import {CardsStore} from '@/stores/CardsStore';
import {CardPricesStore} from '@/stores/CardPricesStore';
import {UserCardsStore} from '@/stores/UserCardsStore';
import {SetsStore} from '@/stores/SetsStore';

export async function preload(): Promise<void> {
  const cardStore = new CardsStore();
  const setsStore = new SetsStore();
  const priceStore = new CardPricesStore();
  const userCardsStore = new UserCardsStore();

  await Promise.allSettled([
    userCardsStore.loadIfAbsent(),
    setsStore.loadIfAbsent(),
  ]);

  //cards
  const cardUids = [...new Set(userCardsStore.userCards.map((e: UserCardVmV1) => e.cardUid))] as string[];
  await cardStore.reloadCardsByUids(cardUids);

  //cards fallback and missing cards
  const cardFutures = cardUids.map((uid: string) => {
    let future = Promise.resolve();

    const card = cardStore.cardsByUid.get(uid);
    if (!card) {
      future = future.then(() => cardStore.reloadCardByUid(uid));
    }

    return future;
  });
  await Promise.allSettled(cardFutures);

  //prices
  const cardIds = [...new Set(cardUids
    .map((uid: string) => cardStore.cardsByUid.get(uid)?.id)
    .filter(e => !!e)
    .map(e => e!),
  )];
  await priceStore.reloadCardPricesByIds(cardIds);

  //prices fallback and missing prices
  const priceFutures = cardIds.map((cardId: string) => {
    let future = Promise.resolve();

    const price = priceStore.cardPricesById.get(cardId);
    if (!price) {
      future = future.then(() => priceStore.reloadCardPriceById(cardId));
    }

    return future;
  });
  await Promise.allSettled(priceFutures);
}