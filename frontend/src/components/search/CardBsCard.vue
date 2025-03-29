<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';
import {CardBriefVmV1, CardVmV1} from 'pokecards-oas';

@Component
export default class CardBsCard extends Vue {
  @Prop({required: true})
  card!: CardBriefVmV1 | CardVmV1 | null;

  get image(): string {
    if (this.card) {
      return this.card.image + '/low.webp';
    } else {
      return '';
    }
  }
}
</script>

<template>
  <div class="card">
    <img :src="image" class="card-img-top" :alt="card?.name">
    <div class="card-body">
      <h5 class="card-title">{{ card?.name }}</h5>
      Id: {{ card?.id }}
    </div>
  </div>
</template>
