<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';
import {CardVmV1} from 'pokecards-oas';
import {getCurrentInstance} from "vue";
import {findPrice, formatPrice} from '@/util/price';

@Component({
  emits: ['update:modelValue'],
})
export default class VariantsRadios extends Vue {
  @Prop({required: true})
  card!: CardVmV1;
  @Prop({required: true})
  modelValue!: string;

  get normalOrHoloPrice(): string | null {
    if (!this.card) {
      return null;
    }
    const priceValue = findPrice(this.card, 'normal');
    if (!priceValue) {
      return null;
    }
    return formatPrice(priceValue, this.$i18n.locale);
  }

  get reverseHoloPrice(): string | null {
    if (!this.card) {
      return null;
    }
    const priceValue = findPrice(this.card, 'reverse');
    if (!priceValue) {
      return null;
    }
    return formatPrice(priceValue, this.$i18n.locale);
  }

  get uid(): number {
    return getCurrentInstance()?.uid!;
  }

  get url(): string | null {
    // if (!this.card) {
    //   return null;
    // }
    // const price = this.getOrFetchPrice(this.card.id);
    // if (!price) {
    //   return null;
    // }
    // return price.cardmarket.url;
    return null;
  }
}
</script>

<template>
  <div>
    <template v-for="variant in Object.keys(card.variants)">
      <div class="d-flex flex-row" v-if="(card.variants as any)[variant]" :key="variant">
        <div class="form-check" style="width: 8em">
          <input class="form-check-input" type="radio"
                 :id="uid + '_' + variant"
                 :name="uid + '_variants'"
                 :value="variant"
                 :checked="variant === modelValue"
                 @change="$emit('update:modelValue', variant)">
          <label class="form-check-label no-select" :for="uid + '_' + variant">
            {{ $t('card.model.variants.' + variant) }}
          </label>
        </div>
        <a :href="url ?? undefined" target="_blank">
          <span class="ms-4" v-if="variant.toLowerCase().includes('reverse')">{{ reverseHoloPrice }}</span>
          <span class="ms-4" v-else>{{ normalOrHoloPrice }}</span>
        </a>
      </div>
    </template>
  </div>
</template>
