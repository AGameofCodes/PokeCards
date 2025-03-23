<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';

export type SpinnerType =
    'text-primary'
    | 'text-secondary'
    | 'text-success'
    | 'text-danger'
    | 'text-warning'
    | 'text-info'
    | 'text-light'
    | 'text-dark';

@Component({
  name: 'Spinner',
  components: {},
})
export default class Spinner extends Vue {
  @Prop({default: null})
  readonly style!: SpinnerType | null;
  @Prop({default: null})
  readonly size!: number | null;

  get internalStyle(): any {
    return {
      height: this.size + 'em',
      width: this.size + 'em',
    };
  }
}
</script>

<template>
  <div class="spinner-border" :class="[style]" :style="internalStyle" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</template>
