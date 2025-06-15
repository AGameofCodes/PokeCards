<script lang="ts">
import {Component, Prop, Vue} from 'vue-facing-decorator';

export type DropDownSortOption = {
  name: string;
  display: string;
};

@Component
export default class SortDropDown extends Vue {
  @Prop({required: true})
  modelValue!: DropDownSortOption;
  @Prop({required: true})
  options!: DropDownSortOption[];
}
</script>

<template>
  <div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
      <slot/>
    </button>
    <ul class="dropdown-menu">
      <li v-for="option in options">
        <a class="dropdown-item"
           :class="{'active': option.name === modelValue.name}"
           href="#"
           @click.prevent="$emit('update:modelValue', option)">
          {{ option.display }}
        </a>
      </li>
    </ul>
  </div>
</template>
