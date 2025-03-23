<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';
import SideBarNavItem from '@/components/sidebar/SideBarNavItem.vue';

@Component({
  name: 'SideBarNavLink',
  components: {SideBarNavItem},
})
export default class SideBarNavLink extends Vue {
  @Prop({required: false})
  faIcon!: string;
  @Prop({required: false})
  text!: string;
  @Prop({required: true})
  to!: string;
}
</script>

<style>
.no-link, .no-link:link, .no-link:hover {
  color: inherit;
  text-decoration: inherit;
}

.selected {
  color: rgba(var(--bs-link-color-rgb), var(--bs-link-opacity, 1));
}
</style>

<template>
  <SideBarNavItem :fa-icon="faIcon" :text="text" :class="{'selected': $router.currentRoute.value.fullPath == to}">
    <template #text="props">
      <RouterLink :to="to" class="no-link">
        {{ props.text }}
      </RouterLink>
    </template>
  </SideBarNavItem>
</template>
