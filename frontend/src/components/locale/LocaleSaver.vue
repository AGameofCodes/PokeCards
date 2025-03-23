<script lang="ts">
import {Component, Vue, Watch} from 'vue-facing-decorator';

@Component({name: 'LocaleSaver'})
export default class LocaleSaver extends Vue {
  mounted(): void {
    const locale = window.localStorage.getItem('locale');
    if (locale)
      this.$i18n.locale = locale;
  }

  @Watch('$i18n.locale')
  onLocaleChanged(value: string): void {
    window.localStorage.setItem('locale', value);
  }
}
</script>

<template>
</template>
