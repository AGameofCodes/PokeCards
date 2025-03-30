<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';
import SideBarNavItem from '@/components/sidebar/SideBarNavItem.vue';
import SideBarNavLink from '@/components/sidebar/SideBarNavLink.vue';
import SideBarHead from '@/components/sidebar/SideBarHead.vue';
import LocaleSelector from '@/components/locale/LocaleSelector.vue';
import BootstrapThemeSwitch from '@/components/bootstrapThemeSwitch/BootstrapThemeSwitch.vue';
import {SessionStore} from '@/stores/SessionStore';

@Component({
  name: 'SideBar',
  components: {
    BootstrapThemeSwitch,
    LocaleSelector,
    SideBarHead,
    SideBarNavLink,
    SideBarNavItem,
  },
  emits: ['close']
})
export default class SideBar extends Vue {
  @Prop({default: false})
  toggled!: boolean;

  private readonly sessionStore = new SessionStore();

  get loggedIn(): boolean {
    return this.sessionStore.isLoggedIn;
  }

  async mounted(): Promise<void> {
    await this.sessionStore.loadIfAbsent();
  }
}
</script>

<template>
  <div :class="{ toggled: toggled }" class="sidebar border-right shadow bg-body d-flex flex-column">
    <SideBarHead @close="$emit('close')"/>
    <div class="flex-grow-1 overflow-y-auto">
      <ul class="nav flex-column">
        <SideBarNavLink v-if="loggedIn" :text="$t('menu.main')" to="/" faIcon="fa-chart-line"
                        @click="$emit('close')"/>
        <SideBarNavLink v-if="loggedIn" :text="$t('menu.search')" to="/search" faIcon="fa-search"
                        @click="$emit('close')"/>
        <SideBarNavLink v-if="loggedIn" :text="$t('menu.userCards')" to="/userCards" faIcon="fa-file"
                        @click="$emit('close')"/>
        <SideBarNavLink v-if="loggedIn" :text="$t('menu.labels')" to="/labels" faIcon="fa-ribbon"
                        @click="$emit('close')"/>
        <SideBarNavLink :text="$t('menu.about')" to="/about" faIcon="fa-question"
                        @click="$emit('close')"/>
        <li>
          <hr class="m-0"/>
        </li>
        <SideBarNavItem :text="$t('locale')" faIcon="fa-language">
          <template #end>
            <LocaleSelector class="navbar-locale-select me-1"/>
          </template>
        </SideBarNavItem>
        <SideBarNavItem :text="$t('design')" faIcon="fa-moon">
          <template #end>
            <BootstrapThemeSwitch class="navbar-theme-switch"/>
          </template>
        </SideBarNavItem>
      </ul>
    </div>
  </div>
</template>
<style lang="scss">
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins/breakpoints';

$width: 15em;

.sidebar {
  width: $width;
  max-width: #{'clamp(0em, '}$width#{', 100%)'};
  transition: width ease-in-out 0.25s;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
}

@include media-breakpoint-down(sm) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;

    &:not(.toggled) {
      width: 0 !important;
    }

    .sidebar-nav-item {
      border-top: 0;
      border-bottom: 0;
    }
  }
}
</style>
