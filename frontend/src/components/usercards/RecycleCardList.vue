<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';
import CardBsCard from "@/components/cards/CardBsCard.vue";
import {formatPrice} from '@/util/price';
import {RecycleScroller} from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import {Resize, type ResizeEvent} from '@/directives/Resize';
import type {CardDisplayCompound} from '@/components/usercards/UserCards.vue';

@Component({
  components: {
    CardBsCard,
    RecycleScroller,
  },
  directives: {
    Resize,
  },
  emits: ['open'],
})
export default class UserCards extends Vue {
  @Prop({required: true})
  cards!: CardDisplayCompound[];

  formatPrice = formatPrice;

  itemWidth = 100;
  itemsPerLine = 4;
  itemHeight = 100;
  listWidth = 100;

  onResize(event: ResizeEvent): void {
    this.listWidth = event.inlineSize;
    this.recomputeGrid();
  }

  recomputeGrid(): void {
    //perRow
    this.itemsPerLine = Math.max(Math.floor(this.listWidth / 200), 1);

    //width
    this.itemWidth = this.listWidth / this.itemsPerLine;

    //height
    this.itemHeight = this.itemWidth * 2;
  }
}
</script>

<template>
  <RecycleScroller
      ref="scroller"
      :items="cards"
      :item-size="itemHeight"
      :grid-items="itemsPerLine"
      :item-secondary-size="itemWidth"
      :buffer="2000"
      :itemClass="'pe-1 pb-1'"
      v-resize="onResize"
  >
    <template #default="{ item, index }">
      <CardBsCard :card="item.card" class="c-pointer"
                  @click="item.card && $emit('open', {card: item.card, userCard: item.userCard})">-->
        <template #afterNumber>
          <div class="ms-auto">
            <span class="badge text-bg-secondary">
              {{ (item.userCard.variant ?? '?').charAt(0).toUpperCase() }}
            </span>
          </div>
        </template>
        <template #end>
          <div>
            {{ $t('price.price') }}:
            <template v-if="item.priceValue">
              <a :href="undefined" target="_blank" @click.stop
                 :style="{color: item.priceIgnore ? 'red' : undefined}"
                 :title="item.priceIgnore ? $t('price.priceNotCountedInTotal') : undefined">
                {{ formatPrice(item.priceValue, $i18n.locale) }}
              </a>
            </template>
            <template v-else>
              ?
            </template>
          </div>
        </template>
      </CardBsCard>
    </template>
  </RecycleScroller>
</template>