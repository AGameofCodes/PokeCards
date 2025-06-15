<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import {UserCardsStore} from '@/stores/UserCardsStore';
import {VueGoodTable} from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css';
import '@/assets/vue-good-table/themes/bootstrap/bootstrap.scss';
import '@/assets/vue-good-table/mobile.scss';
import Loading from '@/components/Loading.vue';
import CardBsCard from "@/components/cards/CardBsCard.vue";
import {CardsStore} from "@/stores/CardsStore";
import {CardVmV1, PriceVmV1, SetVmV1, UserCardVmV1} from "pokecards-oas";
import UserCardEditModal from "@/components/cards/UserCardEditModal.vue";
import {SetsStore} from '@/stores/SetsStore.ts';
import {CardPricesStore} from '@/stores/CardPricesStore.ts';
import {findPrice, formatPrice} from '@/util/price.ts';

type CardFilterPredicate = (card: CardVmV1) => boolean;
type CardDisplayCompound = {
  userCard: UserCardVmV1;
  card: CardVmV1 | null;
  set: SetVmV1 | null;
  price: PriceVmV1 | null;
  priceValue: number | null;
}

@Component({
  components: {
    CardBsCard,
    Loading,
    UserCardEditModal,
    VueGoodTable,
  },
})
export default class UserCards extends Vue {
  readonly cardStore = new CardsStore();
  readonly setsStore = new SetsStore();
  readonly priceStore = new CardPricesStore();
  readonly userCardsStore = new UserCardsStore();

  filter = '';
  formatPrice = formatPrice;

  async mounted(): Promise<void> {
    await Promise.allSettled([
      this.userCardsStore.loadIfAbsent(),
      this.setsStore.loadIfAbsent(),
    ]);
  }

  get cards(): CardDisplayCompound[] {
    return this.userCardsStore.userCards.map((e: UserCardVmV1) => {
      const card = this.getOrFetchCard(e.cardUid);
      const set = !card ? null : this.setsStore.setsByLanguageAndId.get(card.language)?.get(card.setId) ?? null;
      const price = !card ? null : this.getOrFetchPrice(card.id) ?? null;
      const priceValue = !price ? null : findPrice(price, e.variant);
      return {
        userCard: e,
        card: card,
        set: set,
        price: price,
        priceValue: priceValue,
      };
    });
  }

  get filteredCards(): CardDisplayCompound[] {
    let trimmedFilter = this.filter.trim();
    if (!trimmedFilter.length) {
      return this.cards;
    }

    let terms = this.filter.split(' ');
    let numbers = new Set(terms.filter((t) => t.match(/^[0-9]+$/)).map(t => parseInt(t)));
    let texts = terms.filter((t) => !t.match(/^[0-9]+$/));

    let predicates: CardFilterPredicate[] = [];
    if (numbers.size) {
      predicates.push((card: CardVmV1) => numbers.has(parseInt(card.number ?? card.id.split('-')[1] ?? '-1')));
    }

    if (texts.length) {
      const lowerTexts = new Set(texts.map(e => e.toLocaleLowerCase()));
      let matchingSets = this.setsStore.sets.filter((s: SetVmV1) => lowerTexts.has(s.abbreviation.toLocaleLowerCase()));
      if (matchingSets.length) {
        const setPredicates: CardFilterPredicate[]
            = matchingSets.map((s: SetVmV1) => ((card: CardVmV1) => card.setId === s.id && card.language === s.language));
        predicates.push((card: CardVmV1) => setPredicates.some(p => p(card)));
      }

      const allSetAbbreviations = this.setsStore.sets.map((s: SetVmV1) => s.abbreviation.toLocaleLowerCase());
      const remainingTexts = texts.map(t => t.toLocaleLowerCase()).filter(t => !allSetAbbreviations.includes(t));

      if (remainingTexts.length) {
        predicates.push((card: CardVmV1) => remainingTexts.every(t => card.name.toLocaleLowerCase().includes(t.toLocaleLowerCase())));
      }
    }

    return this.cards.filter(e => e.card && predicates.every(p => p(e.card!)));
  }

  get sortedAndFilteredCards(): CardDisplayCompound[] {
    const filteredCards = [...this.filteredCards];
    filteredCards.sort((l, r) => {
      const setCompare = (l.set?.abbreviation ?? l.card?.setId ?? l.card?.id.split('-')[0] ?? '')
          .localeCompare(r.set?.abbreviation ?? r.card?.setId ?? r.card?.id.split('-')[0] ?? '');
      if (setCompare !== 0) {
        return setCompare;
      }

      return parseInt(l.card?.number ?? l.card?.id.split('-')[1] ?? '0')
          - parseInt(r.card?.number ?? r.card?.id.split('-')[1] ?? '0');
    });
    return filteredCards;
  }

  getOrFetchCard(uid: string): CardVmV1 | null {
    const card = this.cardStore.cardsByUid.get(uid);
    if (card) {
      return card;
    }

    this.cardStore.reloadCardByUid(uid);
    return null;
  }

  getOrFetchPrice(cardId: string): PriceVmV1 | null {
    const price = this.priceStore.cardPricesById.get(cardId);
    if (price) {
      return price;
    }

    this.priceStore.reloadCardPriceById(cardId);
    return null;
  }

  async openCard(card: CardVmV1, userCard: UserCardVmV1): Promise<void> {
    await (this.$refs.editModal as UserCardEditModal).open(card, userCard);
  }
}
</script>

<template>
  <div class="d-flex flex-column">
    <div class="d-flex flex-row mb-2">
      <div class="flex-grow-1">
        <input class="form-control" v-model="filter"/>
      </div>
      <div class="btn-group ms-2">
        <button class="btn btn-secondary" @click="userCardsStore.reload()">
          <i class="fa fa-refresh"/>
        </button>
      </div>
    </div>

    <Loading v-if="userCardsStore.loading || setsStore.loading"/>
    <div v-else class="flex-grow-1 d-flex flex-row flex-wrap overflow-auto">
      <div v-for="{userCard, card, priceValue} in sortedAndFilteredCards"
           :key="userCard.id"
           class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 pe-1 pb-1">
        <CardBsCard :card="card" class="c-pointer" @click="card && openCard(card, userCard)">
          <div>
            {{ $t('price') }}: {{ priceValue ? formatPrice(priceValue, $i18n.locale) : '?' }}
          </div>
        </CardBsCard>
      </div>
    </div>

    <UserCardEditModal ref="editModal"/>
  </div>
</template>
