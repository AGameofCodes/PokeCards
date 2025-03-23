<script lang="ts">
import {Component, Vue, Watch} from 'vue-facing-decorator';
import {reactive} from 'vue';

export const sharedDarkMode = reactive({
  internalDarkMode: false,
  internalLoaded: false,

  get darkMode() {
    if (!this.internalLoaded) {
      this.internalDarkMode = localStorage.getItem('darkmode') === ('' + true);
      this.internalLoaded = true;
    }
    return this.internalDarkMode;
  },

  set darkMode(value: boolean) {
    this.internalDarkMode = value;
    localStorage.setItem('darkmode', '' + this.internalDarkMode);
  },
});

@Component({
  name: 'BootstrapThemeSwitch',
})
export default class BootstrapThemeSwitch extends Vue {
  get sharedDarkMode() {
    return sharedDarkMode;
  }

  mounted(): void {
    this.onThemeChanged(this.dark);
  }

  get dark(): boolean {
    return this.sharedDarkMode.darkMode;
  }

  set dark(value: boolean) {
    this.sharedDarkMode.darkMode = value;
  }

  @Watch('dark', {immediate: true})
  private onThemeChanged(isDarkMode: boolean): void {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-bs-theme');
    }
  }
}
</script>

<template>
  <div class="form-check form-switch light-dark-switch">
    <input class="form-check-input" type="checkbox" role="switch" v-model="dark">
  </div>
</template>

<style scoped>
.light-dark-switch .form-check-input {
  --bs-form-switch-bg: url(assets/sun.svg) !important;
}

.light-dark-switch .form-check-input:focus {
  --bs-form-switch-bg: url(assets/sun_focus.svg) !important;
}

.light-dark-switch .form-check-input:checked,
.light-dark-switch .form-check-input:checked:focus {
  --bs-form-switch-bg: url(assets/moon.svg) !important;
}
</style>
