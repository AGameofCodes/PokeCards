<script lang="ts">
import LoggedInComponent from '@/components/navbar/LoggedInComponent.vue';
import LoginComponent from '@/components/auth/LoginComponent.vue';
import {SessionStore} from '@/stores/SessionStore';
import {Component, Vue} from 'vue-facing-decorator';
import {getCurrentInstance} from 'vue';
import ProfilePicture from '@/components/navbar/ProfilePicture.vue';
import {Dropdown} from 'bootstrap';

@Component({
  name: 'UserAccountDropdown',
  methods: {getCurrentInstance},
  components: {
    LoggedInComponent,
    LoginComponent,
    ProfilePicture,
  },
})
export default class UserAccountDropdown extends Vue {
  readonly sessionStore = new SessionStore();

  get uid(): number {
    return getCurrentInstance()!.uid;
  }

  async mounted(): Promise<void> {
    await this.sessionStore.loadIfAbsent();
  }

  closeDropDown(): void {
    const el = this.$refs.dropdownTrigger as HTMLElement;
    Dropdown.getOrCreateInstance(el)?.hide();
  }
}
</script>
<template>
  <div class="dropdown">
    <div ref="dropdownTrigger" class="m-1 d-flex align-items-center c-pointer" :id="'userdropdown' + uid"
         data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
      <ProfilePicture size="32"/>
    </div>
    <ul class="dropdown-menu dropdown-menu-end text-small shadow"
        :aria-labelledby="'userdropdown' + uid">
      <li v-if="!sessionStore.session" style="margin: -.5em 0">
        <LoginComponent class="m-3"/>
      </li>
      <LoggedInComponent v-if="sessionStore.user" @actionClicked="closeDropDown"/>
    </ul>
  </div>
</template>
