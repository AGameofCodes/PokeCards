<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';
import ConfirmModal from './ConfirmModal.vue';
import Spinner from '@/components/Spinner.vue';

@Component({
  name: 'DeleteConfirmModal',
  components: {
    ConfirmModal,
    Spinner,
  },
  emits: ['confirm'],
})
export default class DeleteConfirmModal extends Vue {
  //props
  @Prop({default: true})
  readonly closeOnOutsideClick!: boolean;
  @Prop({default: true})
  readonly closeOnKeyboardEsc!: boolean;
  @Prop({default: false})
  readonly scrollable!: boolean;
  @Prop({default: false})
  readonly centerVertically!: boolean;
  @Prop({default: undefined})
  readonly size!: 'sm' | 'lg' | 'xl' | null | undefined;
  @Prop({default: false})
  readonly deleting!: boolean;

  //public functions
  open(): Promise<void> {
    return (this.$refs.modal as ConfirmModal).open();
  }

  dismiss(): Promise<void> {
    return (this.$refs.modal as ConfirmModal).dismiss();
  }
}
</script>

<template>
  <ConfirmModal ref="modal"
                :closeOnOutsideClick="closeOnOutsideClick"
                :closeOnKeyboardEsc="closeOnKeyboardEsc"
                :scrollable="scrollable"
                :centerVertically="centerVertically"
                :size="size"
                :confirming="deleting">
    <template #modal-header>
      <slot name="modal-header">
        <h5 class="modal-title">
          <slot name="modal-title">
            {{ $t('general.confirmation') }}
          </slot>
        </h5>
        <button aria-label="Close" type="button" class="btn-close" @click="dismiss"></button>
      </slot>
    </template>
    <template #default>
      <slot>
        <p>Modal body text goes here.</p>
      </slot>
    </template>
    <template #modal-footer>
      <slot name="modal-footer">
        <button class="btn btn-secondary" type="button" @click="dismiss" :disabled="deleting">
          {{ $t('general.cancel') }}
        </button>
        <button class="btn btn-danger" type="button" @click="$emit('confirm')" :disabled="deleting">
          <Spinner v-if="deleting" :style="'text-light'" size="1" class="me-1"/>
          <slot name="confirmButtonText">
            {{ $t(deleting ? 'general.deleting' : 'general.delete') }}
          </slot>
        </button>
      </slot>
    </template>
  </ConfirmModal>
</template>
