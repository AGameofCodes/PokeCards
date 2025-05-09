<script lang="ts">
import {ApiException, LoginRequestVmV1, LoginResponseVmV1} from 'pokecards-oas';
import {Component, Vue} from 'vue-facing-decorator';
import {SessionStore} from '@/stores/SessionStore';
import {ApiStore} from '@/stores/ApiStore';
import {ConfigStore} from "@/stores/ConfigStore.ts";

@Component({
  name: 'LoginComponent',
  components: {},
  emits: ['loggedIn'],
})
export default class LoginComponent extends Vue {
  username: string = '';
  password: string = '';

  error: string = '';

  private readonly apiStore = new ApiStore();
  private readonly configStore = new ConfigStore();
  private readonly sessionStore = new SessionStore();

  mounted() {
    this.configStore.loadIfAbsent();
  }

  async login(): Promise<void> {
    this.error = '';
    try {
      const res = await this.apiStore.authApi.login(LoginRequestVmV1.fromJson({
        username: this.username,
        password: this.password,
      }));
      if (res.success) {
        this.sessionStore.setSession(res.user!, res.session!);
        this.$emit('loggedIn');
      } else {
        this.error = 'Something went wrong (unknown reason).';
      }
    } catch (err) {
      this.error = (err as ApiException<LoginResponseVmV1>).body.message ?? '';
    }
  }
}
</script>

<template>
  <div>
    <div class="width"></div>
    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>
    <div class="mb-3">
      {{ $t('auth.username') }}
      <input type="text" class="form-control" v-model="username"/>
    </div>
    <div class="mb-3">
      {{ $t('auth.password') }}
      <input type="password" class="form-control" v-model="password" @keydown.enter="login"/>
    </div>
    <div class="d-flex flex-row align-items-center mb-3">
      <RouterLink v-if="configStore.config?.registerEnabled" to="/register">{{ $t('auth.register') }}</RouterLink>
      <button class="btn btn-primary ms-auto" @click="login">{{ $t('auth.login') }}</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins/breakpoints';

@include media-breakpoint-down(sm) {
  .width {
    width: calc(100vw - 3em);
    transition: width .125s ease-in-out;
  }
}

@include media-breakpoint-up(sm) {
  .width {
    width: 18em;
    transition: width .125s ease-in-out;
  }
}
</style>
