<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';

@Component({
  name: 'SettingsView',
  components: {},
})
export default class SettingsView extends Vue {
}
</script>

<template>
  <div class="p-2">
    <h1>{{ $t('settings.settings') }}</h1>
    {{ $t('settings.currentlyNoSettings') }}
  </div>
</template>
