<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import {SessionStore} from '@/stores/SessionStore';
import Loading from '@/components/Loading.vue';
import {getCurrentInstance} from 'vue';
import {Validate} from '@/directives/Validate';
import {UserInfoVmV1} from 'pokecards-oas';
import Spinner from '@/components/Spinner.vue';
import {checkValidity} from '@/util/validation';
import {savedToast} from '@/util/toast';
import {handleError} from '@/util/util';
import {ApiStore} from '@/stores/ApiStore';
import Card from '@/components/Bootstrap/Card.vue';
import Alert from '@/components/Bootstrap/Alert.vue';

@Component({
  name: 'Personal',
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
export default class Personal extends Vue {
  readonly api = new ApiStore();
  readonly store = new SessionStore();
  saving = false;

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
      if (!checkValidity(this.$el)) {
        return;
      }

      const res = await this.api.userApi.update(this.user);
      this.store.setSession(res, this.store.session!);

      savedToast(this.$i18n);
    } catch (err) {
      return handleError(this.$i18n, err);
    } finally {
      this.saving = false;
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
          <label :for="uid + 'name'" class="form-label">{{ $t('userinfo.model.name') }}</label>
          <input type="text" class="form-control" :id="uid + 'name'" v-model="user.name"
                 v-validate="{type: UserInfo, prop: 'name', i18n: $i18n}" :disabled="true">
        </div>
        <div class="mb-3">
          <label :for="uid + 'displayName'" class="form-label">{{ $t('userinfo.model.displayName') }}</label>
          <input type="text" class="form-control" :id="uid + 'displayName'" v-model="user.displayName"
                 v-validate="{type: UserInfo, prop: 'displayName', i18n: $i18n}">
        </div>
        <div class="mb-3">
          <label :for="uid + 'email'" class="form-label">{{ $t('userinfo.model.email') }}</label>
          <input type="email" class="form-control" :id="uid + 'email'" v-model="user.email"
                 v-validate="{type: UserInfo, prop: 'email', i18n: $i18n}">
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
