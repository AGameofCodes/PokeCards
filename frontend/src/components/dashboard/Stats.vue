<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import {UserCardsStore} from "@/stores/UserCardsStore.ts";
import {CardsStore} from "@/stores/CardsStore.ts";
import {CardPricesStore} from '@/stores/CardPricesStore.ts';
import {UserCardVmV1} from 'pokecards-oas';
import {findPrice, formatPrice, isCardPriceIgnoredInTotalValue} from '@/util/price.ts';
import {preload} from '@/util/preload.ts';
import Spinner from '@/components/Spinner.vue';

@Component({
  components: {
    Spinner,
  },
})
export default class Stats extends Vue {
  readonly cardStore = new CardsStore();
  readonly priceStore = new CardPricesStore();
  readonly userCardStore = new UserCardsStore();

  preloadFinished = false;

  get setCount(): number {
    const setIds = this.userCardStore.userCards.map((userCard: UserCardVmV1) => {
      const card = this.cardStore.cardsByUid.get(userCard.cardUid);
      if (!card) {
        this.cardStore.reloadCardByUid(userCard.cardUid);
        return null;
      }
      return card.setId;
    });
    return new Set(setIds).size;
  }

  get priceSum(): number {
    const prices: number[] = this.userCardStore.userCards.map((userCard: UserCardVmV1) => {
      if (isCardPriceIgnoredInTotalValue(userCard)) {
        return 0;
      }

      const card = this.cardStore.cardsByUid.get(userCard.cardUid);
      if (!card) {
        this.cardStore.reloadCardByUid(userCard.cardUid);
        return 0;
      }

      const price = this.priceStore.cardPricesById.get(card.id);
      if (!price) {
        this.priceStore.reloadCardPriceById(card.id);
        return 0;
      }

      return findPrice(price, userCard.variant) ?? 0;
    });
    return prices.reduce((l, r) => l + r, 0);
  }

  get priceSumFormatted(): string {
    return formatPrice(this.priceSum, this.$i18n.locale);
  }

  async mounted(): Promise<void> {
    try {
      await preload();
    } finally {
      this.preloadFinished = true;
    }
  }
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">{{ $t('dashboard.stats') }}</h5>
      <div class="card-text">
        <template v-if="preloadFinished">
          <div>{{ $t('dashboard.totalCards') }}: {{ userCardStore.userCards.length }}</div>
          <div>{{ $t('dashboard.totalSets') }}: {{ setCount }}</div>
          <div>{{ $t('price.price') }}: {{ priceSumFormatted }}</div>
        </template>
        <template v-else>
          <Spinner/>
        </template>
      </div>
    </div>
  </div>
</template>
