import {UserCardVmV1} from 'pokecards-oas';
import {CardsStore} from '@/stores/CardsStore';
import {UserCardsStore} from '@/stores/UserCardsStore';
import {SetsStore} from '@/stores/SetsStore';

export async function preload(): Promise<void> {
  const cardStore = new CardsStore();
  const setsStore = new SetsStore();
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
}