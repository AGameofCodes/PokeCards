<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import {CardsStore} from '@/stores/CardsStore';
import {ApiStore} from '@/stores/ApiStore';
import Spinner from '@/components/Spinner.vue';
import UserCardEditModal from '@/components/search/UserCardEditModal.vue';
import {CardBriefVmV1} from 'pokecards-oas';
import CardBsCard from "@/components/search/CardBsCard.vue";
import {getCurrentInstance} from "vue";
import CenterOnParent from "@/components/CenterOnParent.vue";

@Component({
  components: {
    CenterOnParent,
    CardBsCard,
    Spinner,
    UserCardEditModal,
  },
  directives: {},
})
export default class CardSearch extends Vue {
  readonly api = new ApiStore();
  readonly store = new CardsStore();

  availableLanguages = ['en', 'de'];
  searchLanguages = ['en', 'de'];
  searchText = '';
  searchResults: CardBriefVmV1[] = [];
  loading = false;

  get uid(): number {
    return getCurrentInstance()?.uid!;
  }

  async search(): Promise<void> {
    this.loading = true;
    try {
      this.searchResults.splice(0);
      const cards = await this.api.cardApi.search(this.searchText, this.searchLanguages);
      this.searchResults.push(...cards);
    } finally {
      this.loading = false;
    }
  }

  async openCard(cardBrief: CardBriefVmV1): Promise<void> {
    const card = await this.api.cardApi.getByLanguageAndId(cardBrief.language, cardBrief.id);
    await (this.$refs.addModal as UserCardEditModal).open(card, null);
  }
}
</script>

<template>
  <div class="p-2 w-100 h-100 d-flex flex-column">
    <div class="d-flex flex-row align-items-baseline mb-2">
      <input type="text" class="form-control" v-model="searchText" @keydown.enter="search">
      <div class="form-check ms-2" v-for="language in availableLanguages">
        <input class="form-check-input"
               type="checkbox"
               :id="uid + '_' + language"
               :value="language"
               v-model="searchLanguages">
        <label class="form-check-label" :for="uid + '_' + language">
          {{ language }}
        </label>
      </div>
    </div>
    <Spinner v-if="loading"/>
    <CenterOnParent v-else-if="!searchResults.length">
      {{ $t('card.search.noCardsFound') }}
    </CenterOnParent>
    <div v-else class="flex-grow-1 d-flex flex-row flex-wrap overflow-auto">
      <div v-for="card in searchResults" :key="card.id"
           class="col-3 col-lg-3 col-md-4 col-sm-6 pe-1 pb-1">
        <CardBsCard :card="card" class="c-pointer" @click="openCard(card)"/>
      </div>
    </div>
    <UserCardEditModal ref="addModal"/>
  </div>
</template>

<style>
</style>
