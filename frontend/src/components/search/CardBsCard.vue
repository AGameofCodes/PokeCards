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
    return (this.card as CardVmV1)?.setId ?? (this.card as CardBriefVmV1)?.id.split('-')[0];
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
    <img :src="image" class="card-img-top" :alt="card?.name">
    <div class="card-body">
      <h5 class="card-title">{{ card?.name }}</h5>
      <div>Id: {{ card?.id }}</div>
      <div>Set: {{ set?.abbreviation }} <img :src="set?.symbol + '.webp'" height="16" alt="set symbol"/></div>
    </div>
  </div>
</template>
