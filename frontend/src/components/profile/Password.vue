<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import {SessionStore} from '@/stores/SessionStore';
import Loading from '@/components/Loading.vue';
import {getCurrentInstance} from 'vue';
import {Validate} from '@/directives/Validate';
import {UpdatePasswordRequestV1, UserInfoVmV1} from 'pokecards-oas';
import {checkValidity} from '@/util/validation';
import {savedToast} from '@/util/toast';
import {handleError} from '@/util/util';
import {ApiStore} from '@/stores/ApiStore';
import Card from '@/components/Bootstrap/Card.vue';
import Spinner from '@/components/Spinner.vue';
import Alert from '@/components/Bootstrap/Alert.vue';

@Component({
  name: 'Password',
  components: {
    Alert,
    Card,
    Loading,
    Spinner,
  },
  directives: {
    Validate,
  },
})
export default class Password extends Vue {
  readonly api = new ApiStore();
  readonly store = new SessionStore();
  saving = false;
  password: string = '';
  passwordRepeat: string = '';

  get user(): UserInfoVmV1 {
    return UserInfoVmV1.fromJson(this.store.user);
  }

  get UserInfo() {
    return UserInfoVmV1;
  }

  get uid(): number {
    return getCurrentInstance()?.uid!;
  }

  async mounted(): Promise<void> {
    await this.store.loadIfAbsent();
  }

  async save(): Promise<void> {
    this.saving = true;
    try {
      this.checkPasswordValidity();
      if (!checkValidity(this.$el)) {
        return;
      }

      if (this.password) {
        await this.api.userApi.updatePassword(UpdatePasswordRequestV1.fromJson({
          userId: this.user.id,
          password: this.password,
        }));
        this.password = '';
        this.passwordRepeat = '';
      }

      savedToast(this.$i18n);
    } catch (err) {
      return handleError(this.$i18n, err);
    } finally {
      this.saving = false;
    }
  }

  checkPasswordValidity(): boolean {
    if (!this.password && !this.passwordRepeat) {
      return true;
    }

    const el = this.$refs.passwordRepeatRef as HTMLInputElement;
    if (this.password === this.passwordRepeat) {
      el.setCustomValidity('');
      return true;
    } else {
      el.setCustomValidity(this.$t('userinfo.passwordsDoNotMatch'));
      el.dispatchEvent(new Event('invalid', {bubbles: false}));
      return false;
    }
  }
}
</script>

<template>
  <div>
    <Card>
      <Loading v-if="store.loading"/>
      <Alert v-else-if="!store.isLoggedIn" type="alert-danger">
        {{ $t('error.failedToLoad') }}
      </Alert>
      <div v-else>
        <div class="mb-3">
          <label :for="uid + 'password'" class="form-label">{{ $t('userinfo.password') }}</label>
          <input type="password" class="form-control" :id="uid + 'password'" v-model="password">
        </div>
        <div class="mb-3">
          <label :for="uid + 'passwordRepeat'" class="form-label">{{ $t('userinfo.passwordRepeat') }}</label>
          <input ref="passwordRepeatRef" type="password" class="form-control" :id="uid + 'passwordRepeat'"
                 v-model="passwordRepeat" v-validate="{validator: () => checkPasswordValidity(), i18n: $i18n}">
        </div>
        <div class="d-flex flex-row">
          <button class="btn btn-primary ms-auto" type="button" @click="save" :disabled="saving">
            <Spinner v-if="saving" :style="'text-light'" size="1" class="me-1"/>
            {{ $t('general.save') }}
          </button>
        </div>
      </div>
    </Card>
  </div>
</template>
