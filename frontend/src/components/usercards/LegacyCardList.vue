<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';
import CardBsCard from "@/components/cards/CardBsCard.vue";
import {formatPrice} from '@/util/price';
import type {CardDisplayCompound} from '@/components/usercards/UserCards.vue';

@Component({
  components: {
    CardBsCard,
  },
  emits: ['open'],
})
export default class LegacyCardList extends Vue {
  @Prop({required: true})
  cards!: CardDisplayCompound[];

  formatPrice = formatPrice;
}
</script>

<template>
  <div class="flex-grow-1 d-flex flex-row flex-wrap overflow-auto">
    <div v-for="{userCard, card, priceValue, priceIgnore} in cards"
         :key="userCard.id"
         class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 pe-1 pb-1">
      <CardBsCard :card="card" class="c-pointer"
                  @click="card && $emit('open', {card: card, userCard: userCard})">
        <template #afterNumber>
          <div class="ms-auto">
            <span class="badge text-bg-secondary">
              {{ (userCard.variant ?? '?').charAt(0).toUpperCase() }}
            </span>
          </div>
        </template>
        <template #end>
          <div>
            {{ $t('price.price') }}:
            <template v-if="priceValue">
              <a :href="undefined" target="_blank" @click.stop
                 :style="{color: priceIgnore ? 'red' : undefined}"
                 :title="priceIgnore ? $t('price.priceNotCountedInTotal') : undefined">
                {{ formatPrice(priceValue, $i18n.locale) }}
              </a>
            </template>
            <template v-else>
              ?
            </template>
          </div>
        </template>
      </CardBsCard>
    </div>
  </div>
</template>
