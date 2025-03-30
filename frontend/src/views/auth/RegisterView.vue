<script lang="ts">
import {ApiException, RegisterRequestVmV1, RegisterResponseVmV1} from 'pokecards-oas';
import {Component, Vue} from 'vue-facing-decorator';
import {ApiStore} from '@/stores/ApiStore';
import {SessionStore} from '@/stores/SessionStore';

@Component({
  name: 'RegisterView',
  components: {},
})
export default class RegisterView extends Vue {
  username: string = '';
  password: string = '';

  error: string = '';

  private readonly apiStore = new ApiStore();
  private readonly sessionStore = new SessionStore();

  async register(): Promise<void> {
    this.error = '';
    try {
      const res = await this.apiStore.authApi.register(RegisterRequestVmV1.fromJson({ username: this.username, password: this.password }));
      if (res.success) {
        this.sessionStore.setSession(res.user!, res.session!);
        this.$router.push('/');
      } else {
        this.error = 'Something went wrong (unknown reason).';//TODO translate
      }
    } catch (err) {
      this.error = (err as ApiException<RegisterResponseVmV1>).body.message ?? '';
    }
  }
}
</script>

<template>
  <div class="w-100 h-100 d-flex justify-content-center">
    <div class="align-self-center">
      <div class="card">
        <div class="card-body">
          <div v-if="error" class="alert alert-danger" role="alert">
            {{ error }}
          </div>
          <div class="mb-3">
            {{ $t('auth.username') }}
            <input type="text" class="form-control" v-model="username" />
          </div>
          <div class="mb-3">
            {{ $t('auth.password') }}
            <input type="password" class="form-control" v-model="password" />
          </div>
          <div class="float-right">
            <button class="btn btn-primary" @click="register">{{ $t('auth.register') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
