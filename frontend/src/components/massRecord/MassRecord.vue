<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import Loading from '@/components/Loading.vue';
import {CardsStore} from "@/stores/CardsStore";
import {SetsStore} from '@/stores/SetsStore';
import {CardBriefVmV1, CardVmV1, QueryRequestVmV1, SetVmV1} from 'pokecards-oas';
import {ApiStore} from '@/stores/ApiStore';
import {getCurrentInstance} from 'vue';
import TableRow from '@/components/massRecord/TableRow.vue';
import UserCardEditModal from '@/components/cards/UserCardEditModal.vue';

@Component({
  components: {
    UserCardEditModal,
    Loading,
    TableRow,
  },
})
export default class MassRecord extends Vue {
  readonly api = new ApiStore();
  readonly cardStore = new CardsStore();
  readonly setsStore = new SetsStore();

  availableLanguages = ['en', 'de'];
  searchLanguage = 'en';
  search = '';
  searchResults: CardBriefVmV1[] = [];
  loading = false;
  fetchedSets: Set<string> = new Set(); // to prevent self triggered querying by set

  get searchSet(): SetVmV1 | null {
    if (!this.search.trim().length) {
      return null;
    }
    const sets = (Array.from(this.setsStore.setsByLanguageAndId.get(this.searchLanguage)?.values() ?? []) as SetVmV1[])
        .filter((e: SetVmV1) => e.abbreviation.toLocaleLowerCase() === this.search.toLocaleLowerCase()
            || e.id.toLocaleLowerCase() === this.search.toLocaleLowerCase());
    return sets[0] ?? null;
  };

  get searchCards(): CardVmV1[] {
    if (!this.searchSet) {
      return [];
    }
    this.fetchCardsForSet();
    return Array.from(this.cardStore.cardsByLanguageAndId.get(this.searchLanguage)?.values() ?? [])
        .filter(e => e.setId === this.searchSet!.id)
        .sort((l, r) => parseInt(l.number) - parseInt(r.number));
  }

  get uid(): number {
    return getCurrentInstance()?.uid!;
  }

  async mounted(): Promise<void> {
    await this.setsStore.loadIfAbsent();
  }

  private async fetchCardsForSet(): Promise<void> {
    if (!this.searchSet) {
      return;
    }

    //prevent self triggered loading
    const fetchedSet = this.searchLanguage + '_' + this.searchSet.id;
    if (this.fetchedSets.has(fetchedSet)) {
      return;
    }
    this.fetchedSets.add(fetchedSet);

    //fetch sequentially
    if (this.loading) {
      setTimeout(() => this.fetchCardsForSet(), 100);
      return;
    }

    this.loading = true;
    try {
      const cardBriefs: CardBriefVmV1[] = await this.api.cardApi.query(QueryRequestVmV1.fromJson({
        languages: [this.searchLanguage],
        setIds: [this.searchSet.id],
      }));
      const cardPromises = cardBriefs
          .filter(brief => !this.cardStore.cardsByLanguageAndId.get(this.searchLanguage)?.has(brief.id)) //only load uncached cards
          .map(brief => this.api.cardApi.getByLanguageAndId(this.searchLanguage, brief.id).catch((_: unknown) => null)); //load cards or null if fetch fails
      const maybeCards: (CardVmV1 | null)[] = await Promise.all(cardPromises);
      const cards = maybeCards.filter(maybeCard => maybeCard).map(maybeCard => maybeCard!); //filtered out failed cards
      cards.forEach(card => {
        this.cardStore.updateCard(card);
      });
    } finally {
      this.loading = false;
    }
  }
}
</script>

<template>
  <div class="d-flex flex-column">
    <div class="d-flex flex-row align-items-center mb-2">
      <div class="flex-grow-1">
        <input class="form-control" v-model="search"/>
      </div>
      <div class="form-check ms-2" v-for="language in availableLanguages">
        <input class="form-check-input"
               type="radio"
               :id="uid + '_' + language"
               :value="language"
               v-model="searchLanguage">
        <label class="form-check-label" :for="uid + '_' + language">
          {{ language }}
        </label>
      </div>
    </div>

    <Loading v-if="setsStore.loading || loading"/>
    <div v-else class="flex-grow-1 overflow-auto">
      <table class="table table-striped">
        <thead>
        <tr>
          <th></th>
          <th>{{ '#' }}</th>
          <th>{{ $t('card.model.name') }}</th>
          <th>{{ $t('card.model.variant') }}</th>
          <th>{{ $t('general.count') }}</th>
          <th>{{ $t('general.actions') }}</th>
        </tr>
        </thead>
        <tbody>
        <TableRow v-for="card in searchCards" :key="card.id" :card="card" :modal="$refs.editModal"/>
        </tbody>
      </table>
    </div>
    <UserCardEditModal ref="editModal" />
  </div>
</template>
