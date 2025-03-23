<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import BootstrapThemeSwitch from '@/components/bootstrapThemeSwitch/BootstrapThemeSwitch.vue';
import LocaleSelector from '@/components/locale/LocaleSelector.vue';
import Logo from '@/components/Logo.vue';
import UserAccountDropdown from '@/components/navbar/UserAccountDropdown.vue';

@Component({
  name: 'NavBar',
  components: {
    UserAccountDropdown,
    BootstrapThemeSwitch,
    LocaleSelector,
    Logo,
  },
  emits: ['toggleSidebar'],
})
export default class NavBar extends Vue {
}
</script>

<template>
  <!-- z-index needed, otherwise shadow not showing -->
  <nav class="navbar border-bottom shadow flex-nowrap" style="z-index: 1">
    <div class="d-flex flex-row">
      <div class="navbar-sidebar-toggler mx-1 c-pointer">
        <i class="fa fa-bars me-2" @click="$emit('toggleSidebar')"/>
      </div>
      <Logo class="navbar-logo"/>
    </div>
    <div>
      <div class="d-flex flex-row">
      </div>
    </div>
    <div>
      <div class="d-flex flex-row align-items-center">
        <LocaleSelector class="navbar-locale-select"/>
        <BootstrapThemeSwitch class="navbar-theme-switch ms-2"/>
        <UserAccountDropdown/>
      </div>
    </div>
  </nav>
</template>

<style lang="scss">
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins/breakpoints';

nav.navbar .navbar-logo,
nav.navbar .nav-item {
  margin-inline-end: 1rem;
}

@include media-breakpoint-down(sm) {
  nav.navbar {
    --bs-navbar-padding-x: 0.5rem;
  }

  nav.navbar .navbar-nav {
    display: none;
  }
}

@include media-breakpoint-up(sm) {
  nav.navbar {
    --bs-navbar-padding-x: 1rem;
  }

  nav.navbar .navbar-logo,
  nav.navbar .navbar-sidebar-toggler,
  nav.navbar .navbar-locale-select,
  nav.navbar .navbar-theme-switch {
    display: none;
  }
}
</style>

