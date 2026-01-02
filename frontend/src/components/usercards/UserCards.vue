<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import {UserCardsStore} from '@/stores/UserCardsStore';
import Loading from '@/components/Loading.vue';
import CardBsCard from "@/components/cards/CardBsCard.vue";
import {CardsStore} from "@/stores/CardsStore";
import {CardVmV1, SetVmV1, UserCardVmV1} from "pokecards-oas";
import UserCardEditModal from "@/components/cards/UserCardEditModal.vue";
import {SetsStore} from '@/stores/SetsStore';
import {findPrice, isCardPriceIgnoredInTotalValue} from '@/util/price';
import SortDropDown from '@/components/usercards/SortDropDown.vue';
import * as utilPreload from '@/util/preload';
import {LabelStore} from '@/stores/LabelStore';
import RecycleCardList from '@/components/usercards/RecycleCardList.vue';
import LegacyCardList from '@/components/usercards/LegacyCardList.vue';

type CardFilterPredicate = (compound: CardDisplayCompound) => boolean;
export type CardDisplayCompound = {
  id: string;
  userCard: UserCardVmV1;
  card: CardVmV1 | null;
  set: SetVmV1 | null;
  priceValue: number | null;
  priceIgnore: boolean;
}

type SortOption = {
  name: string;
  display: string;
  comparator: (l: CardDisplayCompound, r: CardDisplayCompound) => number;
}

@Component({
  components: {
    CardBsCard,
    LegacyCardList,
    Loading,
    RecycleCardList,
    SortDropDown,
    UserCardEditModal,
  },
})
export default class UserCards extends Vue {
  readonly cardStore = new CardsStore();
  readonly labelStore = new LabelStore();
  readonly setsStore = new SetsStore();
  readonly userCardsStore = new UserCardsStore();

  baseSortOptions: SortOption[] =
      [{
        name: 'default',
        display: 'userCard.sort.default',
        comparator: (l, r) => {
          const setCompare = (l.set?.abbreviation ?? l.card?.setId ?? l.card?.id.split('-').reverse().slice(1).reverse().join('-') ?? '')
              .localeCompare(r.set?.abbreviation ?? r.card?.setId ?? r.card?.id.split('-').reverse().slice(1).reverse().join('-') ?? '');
          if (setCompare !== 0) {
            return setCompare;
          }

          return parseInt(l.card?.number ?? l.card?.id.split('-').reverse()[0] ?? '0')
              - parseInt(r.card?.number ?? r.card?.id.split('-').reverse()[0] ?? '0');
        },
      }, {
        name: 'price',
        display: 'userCard.sort.price',
        comparator: (l, r) => (l.priceValue ?? 0) - (r.priceValue ?? 0),
      }, {
        name: 'createdAt',
        display: 'userCard.sort.createdAt',
        comparator: (l, r) => l.userCard.createdAt.getTime() - r.userCard.createdAt.getTime(),
      }];
  filter = '';
  preloadFinished = false;
  selectedSortOption: SortOption = {name: '', display: '', comparator: () => 0};

  async mounted(): Promise<void> {
    this.selectedSortOption = this.sortOptions[0];
    try {
      await utilPreload.preload();
    } finally {
      this.preloadFinished = true;
    }
  }

  get cards(): CardDisplayCompound[] {
    if (!this.preloadFinished) {
      return [];
    }
    return this.userCardsStore.userCards.map((userCard: UserCardVmV1) => {
      const card = this.getOrFetchCard(userCard.cardUid);
      const set = !card ? null : this.setsStore.setsByLanguageAndId.get(card.language)?.get(card.setId) ?? null;
      const priceValue = !card ? null : findPrice(card, userCard.variant);
      const priceIgnore = !card ? false : isCardPriceIgnoredInTotalValue(userCard);
      return {
        id: userCard.id,
        userCard: userCard,
        card: card,
        set: set,
        priceValue: priceValue,
        priceIgnore: priceIgnore,
      };
    });
  }

  get filteredCards(): CardDisplayCompound[] {
    let trimmedFilter = this.filter.trim();
    if (!trimmedFilter.length) {
      return this.cards;
    }

    let terms = this.filter.split(' ');
    let props = terms.filter(e => e.includes("=") || e.includes("!="));
    terms = terms.filter((t) => !props.includes(t));
    let numbers = new Set(terms.filter((t) => t.match(/^[0-9]+$/)).map(t => parseInt(t)));
    let texts = terms.filter((t) => !t.match(/^[0-9]+$/));

    let predicates: CardFilterPredicate[] = [];
    if (props.length) {
      predicates.push(...props
          .map(prop => {
            const [key, value] = prop.split('=');
            return (compound: CardDisplayCompound) =>
                Object.entries(compound.card ?? {})
                    .some(([k, v]) => k.toLowerCase() === key.toLowerCase()
                        && JSON.stringify(v).toLowerCase().includes(value.toLowerCase()))
                || Object.entries(compound.userCard ?? {})
                    .some(([k, v]) => k.toLowerCase() === key.toLowerCase()
                        && JSON.stringify(v).toLowerCase().includes(value.toLowerCase()))
                || compound.userCard.labels.some((cardLabel) => {
                  const label = this.labelStore.labelsById.get(cardLabel.labelId);
                  return label?.name.toLowerCase().includes(key.toLowerCase())
                      && JSON.stringify(cardLabel.value).toLowerCase().includes(value.toLowerCase());
                });
          })
          .filter(e => e)
          .map(e => e!));
    }

    if (numbers.size) {
      predicates.push((compound: CardDisplayCompound) =>
          numbers.has(parseInt(compound.card?.number ?? compound.card?.id.split('-').reverse()[0] ?? '-1')));
    }

    if (texts.length) {
      const lowerTexts = new Set(texts.map(e => e.toLocaleLowerCase()));
      let matchingSets = this.setsStore.sets.filter((s: SetVmV1) => lowerTexts.has(s.abbreviation.toLocaleLowerCase()));
      if (matchingSets.length) {
        const setPredicates: CardFilterPredicate[] = matchingSets.map(
            (s: SetVmV1) => ((compound: CardDisplayCompound) => compound.card?.setId === s.id
                && compound.card?.language === s.language));
        predicates.push((compound: CardDisplayCompound) => setPredicates.some(p => p(compound)));
      }

      const allSetAbbreviations = this.setsStore.sets.map((s: SetVmV1) => s.abbreviation.toLocaleLowerCase());
      const remainingTexts = texts.map(t => t.toLocaleLowerCase()).filter(t => !allSetAbbreviations.includes(t));

      if (remainingTexts.length) {
        predicates.push((compound: CardDisplayCompound) =>
            remainingTexts.every(t => compound.card?.name.toLocaleLowerCase().includes(t.toLocaleLowerCase())));
      }
    }

    return this.cards.filter(e => predicates.every(p => p(e)));
  }

  get sortedAndFilteredCards(): CardDisplayCompound[] {
    const filteredCards = [...this.filteredCards];
    filteredCards.sort(this.selectedSortOption.comparator);
    return filteredCards;
  }

  get sortOptions(): SortOption[] {
    return this.baseSortOptions.flatMap(e => [
      {
        name: e.name + '.asc',
        display: this.$t(e.display) + ' (' + this.$t('userCard.sort.asc') + ')',
        comparator: e.comparator,
      }, {
        name: e.name + '.desc',
        display: this.$t(e.display) + ' (' + this.$t('userCard.sort.desc') + ')',
        comparator: (l: CardDisplayCompound, r: CardDisplayCompound) => -e.comparator(l, r),
      },
    ]);
  }

  getOrFetchCard(uid: string): CardVmV1 | null {
    const card = this.cardStore.cardsByUid.get(uid);
    if (card) {
      return card;
    }

    this.cardStore.reloadCardByUid(uid);
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
      <div class="btn-group ms-2">
        <SortDropDown v-model="selectedSortOption" :options="sortOptions">
          <i class="fa fa-sort-alpha-asc"/>
        </SortDropDown>
      </div>
    </div>

    <Loading v-if="userCardsStore.loading || setsStore.loading || !preloadFinished"/>
    <RecycleCardList :cards="sortedAndFilteredCards" @open="openCard($event.card, $event.userCard)"/>
    <!--    <LegacyCardList :cards="sortedAndFilteredCards" @open="openCard($event.card, $event.userCard)"/> -->

    <UserCardEditModal ref="editModal"/>
  </div>
</template>
