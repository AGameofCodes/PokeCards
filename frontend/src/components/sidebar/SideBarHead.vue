<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import Logo from '@/components/Logo.vue';
import UserAccountDropdown from '@/components/navbar/UserAccountDropdown.vue';

@Component({
  name: 'SideBar',
  components: {UserAccountDropdown, Logo},
  emits: ['close'],
})
export default class SideBar extends Vue {
}
</script>

<template>
  <nav class="navbar border-bottom shadow flex-nowrap">
    <div class="c-pointer d-flex flex-row align-items-center">
      <div class="mx-1 sidebar-closer">
        <i class="fa fa-arrow-left me-2" @click="$emit('close')"/>
      </div>

      <Logo/>

      <!-- 'hack' to ensure this nav is the same height as the navbar -->
      <UserAccountDropdown class="d-inline m-0 p-0" style="visibility: hidden; width: 0;"/>
    </div>
  </nav>
</template>
<style lang="scss">
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins/breakpoints';

@include media-breakpoint-up(sm) {
  nav.navbar .sidebar-closer {
    display: none;
  }
}

</style>

