<template>
  <div>
    {{ text }}
    <a href="#" @click.prevent="doUndo">
      {{ i18n.t('general.undo') }}
    </a>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';
import type {VueI18n} from 'vue-i18n';
import {type ToastOptions} from 'vue3-toastify';

@Component
export default class SavedToastWithUndo extends Vue {
  @Prop({required: true})
  readonly undo!: () => Promise<void> | void;
  @Prop({required: true})
  readonly text!: string;
  @Prop({required: true})
  readonly i18n!: VueI18n; //should be injected but isn't

  //prop provided by toast
  @Prop({required: true})
  readonly closeToast!: (e?: MouseEvent) => void;
  @Prop({required: true})
  readonly toastProps!: ToastOptions;

  async doUndo(): Promise<void> {
    await this.undo();
    this.closeToast();
  }
}
</script>

