<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import Password from '@/components/profile/Password.vue';
import Personal from '@/components/profile/Personal.vue';

@Component({
  name: 'Profile',
  components: {
    Password,
    Personal,
  },
})
export default class Profile extends Vue {
}
</script>

<template>
  <div class="profile d-flex flex-row">
    <Personal class="flex-grow-1"/>
    <Password class="flex-grow-1"/>
  </div>
</template>

<style lang="scss" scoped>
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins/breakpoints';

.profile > :not(:last-child) {
  margin-inline-end: map-get($spacers, 2);
}

@include media-breakpoint-down(md) {
  .profile {
    flex-direction: column !important;
    overflow-y: auto !important;

    & > :not(:last-child) {
      margin-inline-end: 0;
      margin-block-end: map-get($spacers, 2);
    }
  }
}
</style>
