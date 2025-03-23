<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';
import {Modal} from 'bootstrap';

@Component({
  name: 'BootstrapModal',
  components: {},
})
export default class BootstrapModal extends Vue {
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

  //runtime
  private shownPromise: Promise<void> | null = null;
  private shownPromiseResolve: (() => void) | null = null;
  private hiddenPromise: Promise<void> | null = null;
  private hiddenPromiseResolve: (() => void) | null = null;

  //props
  get modalDialogClasses() {
    return {
      'modal-dialog-scrollable': this.scrollable,
      'modal-dialog-centered': this.centerVertically,
      'modal-sm': this.size === 'sm',
      'modal-lg': this.size === 'lg',
      'modal-xl': this.size === 'xl',
    };
  }

  //vue life cycle
  mounted(): void {
    this.addListeners();
  }

  updated(): void {
    this.removeListeners();
    this.addListeners();
  }

  beforeDestroy(): void {
    this.removeListeners();
  }

  //public functions
  open(): Promise<void> {
    if (!this.shownPromise) {
      this.shownPromise = new Promise(resolve => this.shownPromiseResolve = resolve);
    }

    this.getModal().show();
    return this.shownPromise;
  }

  dismiss(): Promise<void> {
    if (!this.hiddenPromise) {
      this.hiddenPromise = new Promise(resolve => this.hiddenPromiseResolve = resolve);
    }

    this.getModal().hide();
    return this.hiddenPromise;
  }

  //internal
  private getModalElement(): HTMLElement {
    return this.$refs.modal as HTMLElement;
  }

  private getModal(): Modal {
    return Modal.getOrCreateInstance(this.getModalElement())!;
  }

  private addListeners() {
    this.getModalElement().addEventListener('shown.bs.modal', this.onShown.bind(this));
    this.getModalElement().addEventListener('hidden.bs.modal', this.onHidden.bind(this));
  }

  private removeListeners() {
    this.getModalElement().removeEventListener('shown.bs.modal', this.onShown.bind(this));
    this.getModalElement().removeEventListener('hidden.bs.modal', this.onHidden.bind(this));
  }

  private onShown(): void {
    if (this.shownPromise) {
      //trigger promise chain
      this.shownPromiseResolve!();
      this.shownPromiseResolve = null;
      this.shownPromise = null;
    }
  }

  private onHidden(): void {
    if (this.hiddenPromise) {
      //trigger promise chain
      this.hiddenPromiseResolve!();
      this.hiddenPromiseResolve = null;
      this.hiddenPromise = null;
    }
  }
}
</script>

<template>
  <div ref="modal" :data-bs-backdrop="closeOnOutsideClick" :data-bs-keyboard="closeOnKeyboardEsc" class="modal"
       tabindex="-1">
    <div :class="modalDialogClasses" class="modal-dialog">
      <div class="modal-content">
        <slot name="modal-content">
          <div class="modal-header">
            <slot name="modal-header">
              <h5 class="modal-title">
                <slot name="modal-title">
                  Modal title
                </slot>
              </h5>
              <button aria-label="Close" class="btn-close" type="button" @click="dismiss"></button>
            </slot>
          </div>
          <div class="modal-body">
            <slot>
              <p>Modal body text goes here.</p>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="modal-footer">
              <button class="btn btn-secondary" type="button" @click="dismiss">{{ $t('general.close') }}</button>
            </slot>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
