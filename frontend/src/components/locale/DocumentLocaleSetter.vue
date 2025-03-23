<script lang="ts">
import {Component, Vue, Watch} from 'vue-facing-decorator';

@Component({name: 'DocumentLocaleSetter'})
export default class DocumentLocaleSetter extends Vue {
  mounted(): void {
    this.onLocaleChanged(this.$i18n.locale);
  }

  @Watch('$i18n.locale')
  onLocaleChanged(value: string): void {
    this.setDocumentLocale(value);
  }

  setDocumentLocale(locale: string): void {
    document.documentElement.setAttribute('lang', locale);
  }
}
</script>

<template>
</template>
