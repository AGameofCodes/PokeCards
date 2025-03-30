<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import {UserCardsStore} from "@/stores/UserCardsStore.ts";
import {CardsStore} from "@/stores/CardsStore.ts";

@Component
export default class Stats extends Vue {
  readonly cardStore = new CardsStore();
  readonly userCardStore = new UserCardsStore();

  get setCount(): number {
    const setIds = this.userCardStore.userCards.map(e => {
      const card = this.cardStore.cardsByUid.get(e.cardUid);
      if (!card) {
        this.cardStore.reloadCardByUid(e.cardUid);
        return null;
      }
      return card.setId;
    });
    return new Set(setIds).size;
  }

  async mounted(): Promise<void> {
    await this.userCardStore.loadIfAbsent();
  }
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">{{ $t('dashboard.stats') }}</h5>
      <div class="card-text">
        <div>{{ $t('dashboard.totalCards') }}: {{ userCardStore.userCards.length }}</div>
        <div>{{ $t('dashboard.totalSets') }}: {{ setCount }}</div>
      </div>
    </div>
  </div>
</template>
