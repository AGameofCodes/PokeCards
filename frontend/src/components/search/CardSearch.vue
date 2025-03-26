<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import {CardsStore} from '@/stores/CardsStore';
import {ApiStore} from '@/stores/ApiStore';
import Spinner from '@/components/Spinner.vue';
import UserCardEditModal from '@/components/search/UserCardEditModal.vue';
import {CardBriefVmV1} from 'pokecards-oas';
import CardBsCard from "@/components/search/CardBsCard.vue";

@Component({
  components: {
    CardBsCard,
    Spinner,
    UserCardEditModal,
  },
  directives: {},
})
export default class CardSearch extends Vue {
  readonly api = new ApiStore();
  readonly store = new CardsStore();

  searchText = 'base4-1';
  searchResults: CardBriefVmV1[] = [];
  loading = false;

  async search(): Promise<void> {
    this.loading = true;
    try {
      this.searchResults.splice(0);
      const cards = await this.api.cardApi.search(this.searchText);
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
    Search
    <input type="text" class="form-control mb-2" v-model="searchText" @keydown.enter="search">
    <Spinner v-if="loading"/>
    <div v-else class="flex-grow-1 d-flex flex-row flex-wrap overflow-auto">
      <CardBsCard v-for="card in searchResults"
                  :key="card.id"
                  :card="card"
                  class="col-3 col-lg-3 col-md-4 col-sm-6 pe-1 pb-1 c-pointer"
                  @click="openCard(card)"/>
    </div>
    <UserCardEditModal ref="addModal"/>
  </div>
</template>

<style>
</style>
