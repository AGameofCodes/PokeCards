<template>
  <table>
    <tr v-for="variant in availableVariants" :key="variant.id">
      <td class="form-check">
        <input class="form-check-input" type="radio"
               :id="uid + '_' + variant.id"
               :name="uid + '_variants'"
               :value="variant.id"
               :checked="variant.id === modelValue"
               @change="$emit('update:modelValue', variant.id)">
        <label class="form-check-label no-select" :for="uid + '_' + variant.id">
          {{ variant.label }}
          <small v-if="variant.deprecated" class="vgt-text-disabled">(depr)</small>
        </label>
      </td>
      <td>
        <a :href="url ?? undefined" target="_blank">
          <span class="ms-4">{{ variant.price && formatPrice(variant.price, $i18n.locale) }}</span>
        </a>
      </td>
    </tr>
  </table>
</template>

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

  formatPrice = formatPrice;

  get availableVariants(): { id: string, label: string, price: number | null, deprecated: boolean }[] {
    return [
      ...Object.entries(this.card.variants)
          .filter(([variant, exists]) => exists)
          .map(([variant, exists]) => ({
            id: variant,
            label: this.$t('card.model.variants.' + variant).toString(),
            price: variant.toLowerCase().includes('reverse') ? this.reverseHoloPrice : this.normalOrHoloPrice,
            deprecated: true,
          })),
      ...this.card.variantsDetailed
          .map((variant) => {
            const parts = [
              this.$t('card.model.variantsDetailed.types.' + variant.type).toString(),
              this.$t('card.model.variantsDetailed.sizes.' + variant.size).toString(),
            ]
            let foil = variant.foil ?? '';
            if (foil) {
              parts.push(this.$t('card.model.variantsDetailed.foil') + ': ' + foil);
            }
            let stamp = variant.stamp?.join(', ') ?? ''
            if (stamp) {
              parts.push(this.$t('card.model.variantsDetailed.stamp') + ': ' + stamp);
            }
            return ({
              id: variant.variantId,
              label: parts.join(', '),
              price: findPrice(this.card, variant.variantId),
              deprecated: false,
            });
          }),
    ].toSorted((a, b) => a.label.localeCompare(b.label));
  }

  get normalOrHoloPrice(): number | null {
    if (!this.card) {
      return null;
    }
    const priceValue = findPrice(this.card, 'normal');
    if (!priceValue) {
      return null;
    }
    return priceValue;
  }

  get reverseHoloPrice(): number | null {
    if (!this.card) {
      return null;
    }
    const priceValue = findPrice(this.card, 'reverse');
    if (!priceValue) {
      return null;
    }
    return priceValue;
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
