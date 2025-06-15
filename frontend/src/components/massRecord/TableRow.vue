<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';
import {CardVmV1, UserCardVmV1} from 'pokecards-oas';
import {getCurrentInstance} from 'vue';
import Spinner from '@/components/Spinner.vue';
import {ApiStore} from '@/stores/ApiStore.ts';
import {emptyUUID} from '@/util/util.ts';
import {UserCardsStore} from '@/stores/UserCardsStore.ts';
import {errorToast, savedToast} from '@/util/toast.ts';
import type UserCardEditModal from '@/components/cards/UserCardEditModal.vue';
import VariantsRadios from '@/components/cards/VariantsRadios.vue';

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
              .then((userCard: UserCardVmV1) => this.store.addCard(userCard)));
      await Promise.all(promises);
      savedToast(this.$i18n);
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
