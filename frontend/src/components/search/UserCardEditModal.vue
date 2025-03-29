<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import BootstrapModal from '@/components/modals/BootstrapModal.vue';
import Spinner from '@/components/Spinner.vue';
import {CardVmV1, UserCardLabelVmV1, UserCardVmV1} from 'pokecards-oas';
import {ApiStore} from "@/stores/ApiStore";
import {emptyUUID, handleError} from "@/util/util";
import {UserCardsStore} from "@/stores/UserCardsStore";
import {savedToast} from "@/util/toast";
import {LabelStore} from "@/stores/LabelStore";
import {getCurrentInstance} from "vue";
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import '@/assets/vue-select/bootstrap.css';
import {findForegroundColor} from "@/util/label";

@Component({
  methods: {findForegroundColor},
  components: {
    BootstrapModal,
    Spinner,
    vSelect,
  },
})
export default class UserCardEditModal extends Vue {
  card: CardVmV1 | null = null;
  userCard: UserCardVmV1 | null = null;
  saving = false;

  readonly api = new ApiStore();
  readonly userCardStore = new UserCardsStore();
  readonly labelStore = new LabelStore();

  get isNewUserCard(): boolean {
    return !this.userCard?.id
        || this.userCard.id === emptyUUID();
  }

  get uid(): number {
    return getCurrentInstance()?.uid!;
  }

  open(card: CardVmV1, userCard: UserCardVmV1 | null): Promise<void> {
    this.card = CardVmV1.fromJson(card);
    this.userCard = UserCardVmV1.fromJson(userCard);

    if (this.isNewUserCard) {
      this.userCard = UserCardVmV1.fromJson({
        id: emptyUUID(),
        createdAt: new Date(),
        createdBy: emptyUUID(),
        updatedAt: new Date(),
        updatedBy: emptyUUID(),
        cardUid: this.card!.uid,
        labels: []
      } as UserCardVmV1);
    }

    return (this.$refs.modal as BootstrapModal).open();
  }

  dismiss(): Promise<void> {
    this.card = null;
    this.userCard = null;
    return (this.$refs.modal as BootstrapModal).dismiss();
  }

  getUserCardLabelByLabelId(labelId: string): UserCardLabelVmV1 {
    if (!this.userCard) {
      return new UserCardLabelVmV1();
    }

    let ret = this.userCard.labels.find(e => e.labelId === labelId);
    if (!ret) {
      ret = UserCardLabelVmV1.fromJson({id: emptyUUID(), userCardId: this.userCard.id, labelId: labelId, value: ''});
      this.userCard.labels.push(ret);
    }
    return ret;
  }

  async save(): Promise<void> {
    if (!this.userCard) {
      return;
    }

    this.saving = true;
    try {
      if (this.isNewUserCard) {
        const userCard = await this.api.userCardApi.add(this.userCard);
        this.userCardStore.addCard(userCard);
      } else {
        const userCard = await this.api.userCardApi.update(this.userCard);
        this.userCardStore.updateCard(userCard);
      }
      savedToast(this.$i18n);
      await this.dismiss();
    } catch (err) {
      console.log(err)
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
      <template v-if="isNewUserCard"> {{ $t('userCard.edit.modal.title.add') }}</template>
      <template v-else> {{ $t('userCard.edit.modal.title.update') }}</template>
    </template>
    <template #default v-if="card">
      <div class="d-flex flex-row">
        <img :src="card.image + '/high.webp'" height="400" alt="card img">
        <div class="ms-2">
          <div>{{ $t('userCard.model.id') }}: {{ card.id }}</div>
          <div>{{ $t('userCard.model.name') }}: {{ card.name }}</div>
          <div>{{ $t('userCard.model.number') }}: {{ card.number }}</div>
          <div>{{ $t('userCard.model.language') }}: {{ card.language }}</div>

          <div v-for="label in labelStore.labels" :key="label.id">
            <template v-if="label.type === 'boolean'">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" :id="uid + '_' + label.id"
                       :checked="getUserCardLabelByLabelId(label.id).value === 'true'"
                       @input="getUserCardLabelByLabelId(label.id).value = $event.target.checked ? 'true': ''">
                <span class="badge rounded-pill"
                      :style="{background: label.color, color: findForegroundColor(label.color) ?? 'black'}">
                  <label class="form-check-label" :for="uid + '_' + label.id">
                    {{ label.name }}
                  </label>
                </span>
              </div>
            </template>
            <div class="d-flex flex-row align-items-baseline" v-if="label.type === 'enum'">
              <span class="badge rounded-pill me-2"
                    :style="{background: label.color, color: findForegroundColor(label.color) ?? 'black'}">
                <label :for="uid + '_type'" class="form-label mb-0">
                  {{ $t('label.model.type') }}
                </label>
              </span>
              <vSelect :id="uid + '_type'"
                       v-model="getUserCardLabelByLabelId(label.id).value"
                       :options="label.enumValues?.split(',').map(e => e.trim()).filter(e => !!e)"
                       :clearable="true"
                       theme="bootstrap"/>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #modal-footer>
      <button class="btn btn-secondary" type="button" @click="dismiss" :disabled="saving">
        {{ $t('general.cancel') }}
      </button>
      <button class="btn btn-primary" type="button" @click="save" :disabled="saving">
        <Spinner v-if="saving" :style="'text-light'" size="1" class="me-1"/>
        <template v-if="isNewUserCard"> {{ $t('userCard.edit.modal.save.add') }}</template>
        <template v-else> {{ $t('userCard.edit.modal.save.update') }}</template>
      </button>
    </template>
  </BootstrapModal>
</template>

<style>
.vc-color-wrap {
  width: 100% !important;
  height: 2.375em !important;
  margin-right: 0 !important;
  display: block !important;
  border-radius: var(--bs-border-radius);
  border: var(--bs-border-width) solid var(--bs-border-color);
}
</style>

