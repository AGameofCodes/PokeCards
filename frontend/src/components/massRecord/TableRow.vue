<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';
import {CardVmV1, UserCardVmV1} from 'pokecards-oas';
import {getCurrentInstance} from 'vue';
import Spinner from '@/components/Spinner.vue';
import {ApiStore} from '@/stores/ApiStore';
import {emptyUUID} from '@/util/util';
import {UserCardsStore} from '@/stores/UserCardsStore';
import {deletedToast, errorToast} from '@/util/toast';
import type UserCardEditModal from '@/components/cards/UserCardEditModal.vue';
import VariantsRadios from '@/components/cards/VariantsRadios.vue';
import {toast} from 'vue3-toastify';
import ToastWithUndo from '@/components/massRecord/ToastWithUndo.vue';

@Component({
  components: {
    Spinner,
    VariantsRadios,
  },
})
export default class TableRow extends Vue {
  @Prop({required: true})
  readonly card!: CardVmV1;
  @Prop({required: true})
  readonly modal!: UserCardEditModal;

  readonly api = new ApiStore();
  readonly store = new UserCardsStore();
  count: number = 1;
  selectedVariant: string | null = null;
  saving = false;

  get uid(): number {
    return getCurrentInstance()?.uid!;
  }

  async addUserCard(): Promise<void> {
    this.saving = true;
    try {
      const promises = [...new Array(this.count)]
          .map(_ => this.api.userCardApi.add(this.initUserCard())
              .then((userCard: UserCardVmV1) => {
                this.store.rememberCard(userCard);
                return userCard;
              }));
      const results = await Promise.allSettled(promises);
      const savedCards = results
          .filter(e => e.status === 'fulfilled')
          .map(e => (e as PromiseFulfilledResult<UserCardVmV1>).value);
      const failedReasons = results
          .filter(e => e.status === 'rejected')
          .map(e => (e as PromiseRejectedResult).reason);

      this.savedToast(savedCards);
      if (failedReasons.length > 0) {
        throw new Error(failedReasons.map(e => e.toString()).join(', '));
      }

      this.reset();
    } catch (e) {
      errorToast(this.$t('error.failedToSave'));
      console.error(e);
    } finally {
      this.saving = false;
    }
  }

  addUserCardViaModal(): void {
    this.modal.open(this.card, this.initUserCard(), this.count);
    this.reset();
  }

  private initUserCard(): UserCardVmV1 {
    return UserCardVmV1.fromJson({
      id: emptyUUID(),
      createdAt: new Date(),
      createdBy: emptyUUID(),
      updatedAt: new Date(),
      updatedBy: emptyUUID(),
      cardUid: this.card!.uid,
      variant: this.selectedVariant,
      labels: [],
    });
  }

  private reset() {
    this.count = 1;
    this.selectedVariant = null;
  }

  private savedToast(savedCards: UserCardVmV1[]): void {
    toast.info(ToastWithUndo, {
      autoClose: 3000,
      expandCustomProps: true,
      contentProps: {
        i18n: this.$i18n, //for some reason i18n is not injected
        text: this.$t('general.saved'),
        undo: async () => {
          const undoPromises = savedCards
              .map(e => this.api.userCardApi.remove(e.id)
                  .then(() => this.store.forgetCard(e)));
          const results = await Promise.allSettled(undoPromises);
          const failed = results.filter(e => e.status === 'rejected')
              .map(e => (e as PromiseRejectedResult).reason.toString());

          if (failed.length === 0) {
            deletedToast(this.$i18n);
          } else {
            errorToast(failed.join(', '));
          }
        },
      },
    });
  }
}
</script>

<template>
  <tr>
    <td style="width: 1em"><img :src="card.image + '/low.webp'" style="height: 3em"/></td>
    <td style="width: 1em">{{ card.number }}</td>
    <td>{{ card.name }}</td>
    <td>
      <VariantsRadios :card="card" v-model="selectedVariant"/>
    </td>
    <td>
      <input type="number" class="form-control" style="width: 5em" :min="1" v-model="count"/>
    </td>
    <td>
      <div class="btn-group">
        <button class="btn btn-sm btn-success" @click="addUserCard" :disabled="saving || !selectedVariant">
          <Spinner v-if="saving" :size="1"/>
          <i v-else class="fa fa-plus"/>
        </button>
        <button class="btn btn-sm btn-secondary" @click="addUserCardViaModal">
          <i class="fa fa-cog"/>
        </button>
      </div>
    </td>
  </tr>
</template>
