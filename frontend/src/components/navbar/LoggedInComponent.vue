<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import {SessionStore} from '@/stores/SessionStore';
import {ApiStore} from '@/stores/ApiStore';
import ProfilePicture from '@/components/navbar/ProfilePicture.vue';

@Component({
  name: 'LoggedInComponent',
  components: {ProfilePicture},
  emits: ['actionClicked'],
})
export default class LoggedInComponent extends Vue {
  readonly apiStore: ApiStore = new ApiStore();
  readonly sessionStore: SessionStore = new SessionStore();

  async mounted(): Promise<void> {
    await this.sessionStore.loadIfAbsent();
  }

  onGotoSettings(): void {
    this.$router.push('/settings');
    this.$emit('actionClicked');
  }

  onGotoProfile(): void {
    this.$router.push('/profile');
    this.$emit('actionClicked');
  }

  async onLogout(): Promise<void> {
    const res = await this.apiStore.authApi.logout();
    if (res.success) {
      this.sessionStore.clear();
    }
    this.$router.push('/');
    this.$emit('actionClicked');
  }
}
</script>
<template>
  <div class="width"></div>
  <li>
    <div class="logged-in-header d-flex flex-row">
      <div>
        <ProfilePicture :size="64"/>
      </div>
      <div class="ms-3 d-flex flex-column justify-content-center">
        <div>{{ sessionStore.user?.displayName ?? sessionStore.user?.name }}</div>
        <div><small>{{ sessionStore.user?.email }}</small></div>
      </div>
    </div>
  </li>
  <div class="dropdown-divider"></div>
  <li>
    <a class="dropdown-item c-pointer" @click="onGotoSettings">
      <i class="fa fa-cog"></i>
      {{ $t('menu.settings') }}
    </a>
  </li>
  <li>
    <a class="dropdown-item c-pointer" @click="onGotoProfile">
      <i class="fa fa-user"></i>
      {{ $t('menu.profile') }}
    </a>
  </li>
  <div class="dropdown-divider"></div>
  <li>
    <a class="dropdown-item c-pointer" @click="onLogout">
      <i class="fa fa-power-off"></i>
      {{ $t('auth.logout') }}
    </a>
  </li>
</template>

<style lang="scss" scoped>
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins/breakpoints';

.logged-in-header {
  padding: var(--bs-dropdown-item-padding-y) var(--bs-dropdown-item-padding-x);
}

@include media-breakpoint-down(sm) {
  .width {
    width: 100%;
  }
}

@include media-breakpoint-up(sm) {
  .width {
    width: 18em;
  }
}
</style>