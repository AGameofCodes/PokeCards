<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import Profile from '@/components/profile/Profile.vue';

@Component({
  name: 'ValuesView',
  components: {Profile},
})
export default class ValuesView extends Vue {
}
</script>

<template>
  <Profile class="p-2"/>
</template>
