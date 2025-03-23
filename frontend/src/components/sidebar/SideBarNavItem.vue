<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';

@Component({
  name: 'SideBarNavItem',
  components: {},
})
export default class SideBarNavItem extends Vue {
  @Prop({required: false})
  faIcon!: string;
  @Prop({required: false})
  text!: string;
}
</script>

<template>
  <li class="nav-item sidebar-nav-item">
    <slot>
      <div class="d-flex flex-row p-2 align-items-center">
        <i :class="[faIcon]" class="sidebar-nav-item-icon text-center fa"></i>
        <span class="sidebar-nav-item-text me-auto">
          <slot name="text" :text="text">
            {{ text }}
          </slot>
        </span>
        <slot name="end"/>
      </div>
    </slot>
  </li>
</template>

<style lang="scss" scoped>
.sidebar-nav-item-text {
  opacity: 1;
  overflow: hidden;
  max-width: 10em;
  transition: display ease-in-out 0.25s, opacity ease-in-out 0.25s, max-width ease-in-out 0.25s;
}

.sidebar-nav-item-icon {
  width: 2em;
  text-align: center;
}
</style>
