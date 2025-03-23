<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';

export type AlertType =
    'alert-primary'
    | 'alert-secondary'
    | 'alert-success'
    | 'alert-danger'
    | 'alert-warning'
    | 'alert-light'
    | 'alert-dark';
@Component({
  name: 'Alert',
})
export default class Alert extends Vue {
  @Prop({default: null})
  readonly type: AlertType | null = 'alert-primary';
}
</script>

<template>
  <div class="alert" :class="[type]" role="alert">
    <slot/>
  </div>
</template>
