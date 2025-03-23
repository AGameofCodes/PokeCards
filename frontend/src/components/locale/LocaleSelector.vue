<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';

@Component({name: 'LocaleSelector'})
export default class LocaleSelector extends Vue {
  get locale(): string {
    return this.$i18n.locale;
  }

  set locale(value: string) {
    this.$i18n.locale = value;
  }

  get supportedLocales(): { value: string, text: string } [] {
    return [
      {value: 'en', text: this.$t('locales.en')},
      {value: 'de', text: this.$t('locales.de')},
    ];
  }
}
</script>

<template>
  <div class="dropdown">
    <button aria-expanded="false" class="btn btn-sm btn-outline-secondary" data-bs-toggle="dropdown" type="button">
      <i class="fa fa-language"/>
    </button>
    <ul class="dropdown-menu dropdown-menu-end dropdown-menu-lg-start">
      <li v-for="l in supportedLocales" :key="l.value">
        <a :class="{active: locale === l.value}" class="dropdown-item" href="#"
           @click.prevent="locale = l.value">
          {{ l.text }}
        </a>
      </li>
    </ul>
  </div>
</template>
