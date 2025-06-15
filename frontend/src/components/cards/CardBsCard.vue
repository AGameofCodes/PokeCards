<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';
import {CardBriefVmV1, CardVmV1, SetVmV1} from 'pokecards-oas';
import {SetsStore} from "@/stores/SetsStore";

@Component
export default class CardBsCard extends Vue {
  @Prop({required: true})
  card!: CardBriefVmV1 | CardVmV1 | null;

  readonly setsStore = new SetsStore();

  get image(): string {
    if (this.card) {
      return this.card.image + '/low.webp';
    } else {
      return '';
    }
  }

  get setId(): string {
    return (this.card as CardVmV1)?.setId ?? (this.card as CardBriefVmV1)?.id.split('-').reverse().slice(1).reverse().join('-');
  }

  get number(): string {
    return (this.card as CardVmV1)?.number ?? (this.card as CardBriefVmV1)?.id.split('-').reverse()[0];
  }

  get set(): SetVmV1 | undefined {
    if (!this.card) {
      return undefined;
    }
    return this.getOrFetchSet(this.card.language, this.setId);
  }

  getOrFetchSet(language: string, id: string): SetVmV1 | undefined {
    const set = this.setsStore.setsByLanguageAndId.get(language)?.get(id);
    if (set) {
      return set;
    }

    this.setsStore.reloadSetByLanguageAndId(language, id);
    return undefined;
  }
}
</script>

<template>
  <div class="card">
    <img :src="image" class="card-img-top pokemon-card" :alt="card?.name">
    <div class="card-body">
      <h5 class="card-title text-nowrap text-truncate">{{ card?.name }}</h5>
      <div class="d-flex flex-row">
        <div>{{ $t('card.model.number') }}: {{ number }}</div>
        <slot name="afterNumber"/>
      </div>
      <div>
        {{ $t('card.model.set') }}: {{ set?.abbreviation ?? '?' }}
        <img :src="set?.symbol + '.webp'" height="16" alt=""/>
        <slot name="afterSet"/>
      </div>
      <div>
        <slot name="end"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pokemon-card {
  width: 100%;
  aspect-ratio: 245 / 337;
}
</style>
