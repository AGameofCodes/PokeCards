<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import BootstrapModal from '@/components/modals/BootstrapModal.vue';
import Spinner from '@/components/Spinner.vue';
import {CardVmV1, UserCardVmV1} from 'pokecards-oas';
import {ApiStore} from "@/stores/ApiStore";
import {emptyUUID, handleError} from "@/util/util";
import {UserCardsStore} from "@/stores/UserCardsStore";
import {savedToast} from "@/util/toast";

@Component({
  components: {
    BootstrapModal,
    Spinner,
  },
})
export default class UserCardAddModal extends Vue {
  card: CardVmV1 | null = null;
  saving = false;

  readonly api = new ApiStore();
  readonly store = new UserCardsStore();

  open(card: CardVmV1): Promise<void> {
    this.card = card;
    return (this.$refs.modal as BootstrapModal).open();
  }

  dismiss(): Promise<void> {
    this.card = null;
    return (this.$refs.modal as BootstrapModal).dismiss();
  }

  async addUserCard(): Promise<void> {
    this.saving = true;
    try {
      let userCard = UserCardVmV1.fromJson({
        id: emptyUUID(),
        createdAt: new Date(),
        createdBy: emptyUUID(),
        updatedAt: new Date(),
        updatedBy: emptyUUID(),
        cardUid: this.card!.uid
      } as UserCardVmV1);
      userCard = await this.api.userCardApi.add(userCard);
      this.store.addCard(userCard);
      savedToast(this.$i18n);
      await this.dismiss();
    } catch (err) {
      handleError(this.$i18n, err);
    } finally {
      this.saving = false;
    }
  }
}
</script>

<template>
  <BootstrapModal ref="modal" :scrollable="true">
    <template #modal-title>
      {{ $t('userCard.add.modal.title') }}
    </template>
    <template #default v-if="card">
      <div class="d-flex flex-row">
        <img :src="card.image + '/high.webp'" height="400" alt="card img">
        <div class="ms-2">
          <div>{{ $t('userCard.model.id') }}: {{ card.id }}</div>
          <div>{{ $t('userCard.model.name') }}: {{ card.name }}</div>
          <div>{{ $t('userCard.model.number') }}: {{ card.number }}</div>
          <div>{{ $t('userCard.model.language') }}: {{ card.language }}</div>
        </div>
      </div>
    </template>
    <template #modal-footer>
      <button class="btn btn-secondary" type="button" @click="dismiss" :disabled="saving">
        {{ $t('general.cancel') }}
      </button>
      <button class="btn btn-primary" type="button" @click="addUserCard" :disabled="saving">
        <Spinner v-if="saving" :style="'text-light'" size="1" class="me-1"/>
        {{ $t('userCard.add.modal.addUserCard') }}
      </button>
    </template>
  </BootstrapModal>
</template>
