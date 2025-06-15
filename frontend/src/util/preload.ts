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

  //prices
  const cardIds = [...new Set(cardUids
    .map((uid: string) => cardStore.cardsByUid.get(uid)?.id)
    .filter(e => !!e)
    .map(e => e!),
  )];
  await priceStore.reloadCardPricesByIds(cardIds);
}