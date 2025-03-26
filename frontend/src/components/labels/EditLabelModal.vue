<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import {LabelStore} from '@/stores/LabelStore';
import BootstrapModal from '@/components/modals/BootstrapModal.vue';
import {getCurrentInstance} from 'vue';
import {LabelVmV1} from 'pokecards-oas';
import {ApiStore} from '@/stores/ApiStore';
import {emptyUUID, handleError} from '@/util/util';
import {savedToast} from '@/util/toast';
import {sharedDarkMode} from '../bootstrapThemeSwitch/BootstrapThemeSwitch.vue';
import {ColorPicker} from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import Spinner from '@/components/Spinner.vue';
import {Validate} from '@/directives/Validate';
import {checkValidity, resetValidity} from '@/util/validation';
import {findNewColor} from "@/util/label";
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

@Component({
  name: 'EditLabelModal',
  components: {
    BootstrapModal,
    ColorPicker,
    Spinner,
    vSelect
  },
  directives: {
    Validate,
  },
})
export default class EditLabelModal extends Vue {
  readonly api = new ApiStore();
  readonly store = new LabelStore();
  label = new LabelVmV1();
  isNew = false;
  saving = false;

  get types(): { type: string, label: string }[] {
    return [
      {type: 'enum', label: this.$t('label.model.typeOptions.enum').toString()},
      {type: 'boolean', label: this.$t('label.model.typeOptions.boolean').toString()}
    ]
  }

  get Label() {
    return LabelVmV1;
  }

  get sharedDarkMode() {
    return sharedDarkMode;
  }

  get uid(): number {
    return getCurrentInstance()?.uid!;
  }

  open(label?: LabelVmV1): Promise<void> {
    this.isNew = !label;
    this.label = LabelVmV1.fromJson(!this.isNew ? label : {
      id: emptyUUID(),
      createdAt: new Date(),
      createdBy: emptyUUID(),
      updatedAt: new Date(),
      updatedBy: emptyUUID(),
      name: '',
      type: 'boolean',
      enumValues: '',
      color: findNewColor(this.store.labels.map(e => e.color)),
    });
    resetValidity(this.$el);
    return (this.$refs.modal as BootstrapModal).open();
  }

  dismiss(): Promise<void> {
    return (this.$refs.modal as BootstrapModal).dismiss();
  }

  async save(): Promise<void> {
    this.saving = true;
    try {
      if (!checkValidity(this.$el)) {
        return;
      }

      if (this.isNew) {
        const res = await this.api.labelApi.add(this.label);
        this.store.addLabel(res);
        savedToast(this.$i18n);
      } else {
        const res = await this.api.labelApi.update(this.label);
        this.store.updateLabel(res);
        savedToast(this.$i18n);
      }
      await this.dismiss();
    } catch (err) {
      return handleError(this.$i18n, err);
    } finally {
      this.saving = false;
    }
  }
}
</script>

<template>
  <div>
    <BootstrapModal ref="modal">
      <template #modal-title>
        {{ isNew ? $t('label.create.modalTitle') : $t('label.edit.modalTitle') }}
      </template>
      <div>
        <div class="mb-3">
          <label :for="uid + '_name'" class="form-label">{{ $t('label.model.name') }}</label>
          <input type="text" class="form-control" :id="uid + '_name'" v-model="label.name"
                 v-validate="{type: Label, prop: 'name', i18n: $i18n}">
        </div>
        <div class="mb-3">
          <label :for="uid + '_type'" class="form-label">{{ $t('label.model.type') }}</label>
          <vSelect :id="uid + '_type'"
                   v-model="label.type"
                   :options="types"
                   label="label"
                   :reduce="(option: {type: string}) => option.type"
                   :clearable="false"/>
        </div>
        <div class="mb-3" v-if="label.type === 'enum'">
          <label :for="uid + '_unit'" class="form-label">{{ $t('label.model.enumValues') }}</label>
          <input type="text" class="form-control" :id="uid + '_unit'" v-model="label.enumValues"
                 v-validate="{type: Label, prop: 'unit', i18n: $i18n}">
        </div>
        <div class="mb-3">
          <label :for="uid + '_color'" class="form-label">{{ $t('label.model.color') }}</label>
          <ColorPicker
              :id="uid + '_color'"
              style="height: 2em"
              :disable-alpha="true"
              lang="En"
              :theme="sharedDarkMode.darkMode ? 'black' : 'white'"
              v-model:pureColor="label.color"/>
        </div>
      </div>
      <template #modal-footer>
        <button class="btn btn-secondary" type="button" @click="dismiss" :disabled="saving">
          {{ $t('general.cancel') }}
        </button>
        <button class="btn btn-primary" type="button" @click="save" :disabled="saving">
          <Spinner v-if="saving" :style="'text-light'" size="1" class="me-1"/>
          {{ isNew ? $t('label.create.button') : $t('label.edit.button') }}
        </button>
      </template>
    </BootstrapModal>
  </div>
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
