<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import {UserCardsStore} from '@/stores/UserCardsStore';
import {VueGoodTable} from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css';
import '@/assets/vue-good-table/themes/bootstrap/bootstrap.scss';
import '@/assets/vue-good-table/mobile.scss';
import Loading from '@/components/Loading.vue';
import CardBsCard from "@/components/cards/CardBsCard.vue";
import {CardsStore} from "@/stores/CardsStore";
import {CardBriefVmV1, CardVmV1, UserCardVmV1} from "pokecards-oas";
import UserCardEditModal from "@/components/cards/UserCardEditModal.vue";

@Component({
  components: {
    UserCardEditModal,
    CardBsCard,
    Loading,
    VueGoodTable,
  },
})
export default class UserCards extends Vue {
  readonly userCardsStore = new UserCardsStore();
  readonly cardStore = new CardsStore();

  async mounted(): Promise<void> {
    await this.userCardsStore.loadIfAbsent();
  }

  get cards(): { userCard: UserCardVmV1, card: CardVmV1 | null }[] {
    return this.userCardsStore.userCards.map(e => ({
      userCard: e,
      card: this.getOrFetchCard(e.cardUid),
    }));
  }

  getOrFetchCard(uid: string): CardVmV1 | null {
    const card = this.cardStore.cardsByUid.get(uid);
    if (card) {
      return card;
    }

    this.cardStore.reloadCardByUid(uid)
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
      <div class="btn-group ms-auto">
        <button class="btn btn-secondary" @click="userCardsStore.reload()">
          <i class="fa fa-refresh"/>
        </button>
      </div>
    </div>

    <Loading v-if="userCardsStore.loading"/>
    <div v-else class="flex-grow-1 d-flex flex-row flex-wrap overflow-auto">
      <div v-for="{userCard, card} in cards"
           :key="userCard.id"
           class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 pe-1 pb-1">
        <CardBsCard :card="card" class="c-pointer" @click="card && openCard(card, userCard)"/>
      </div>
    </div>

    <UserCardEditModal ref="editModal"/>
  </div>
</template>
