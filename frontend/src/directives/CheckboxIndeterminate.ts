//v-indeterminate
import type {Directive, DirectiveBinding} from 'vue';
import type {DirectiveHook} from '@vue/runtime-core';

const update: DirectiveHook<HTMLInputElement, any, boolean> =
  (el: HTMLInputElement, binding: DirectiveBinding<boolean>) => {
    el.indeterminate = binding.value;
  };

export const Indeterminate = {
  mounted: update,
  updated: update,
} as Directive<HTMLInputElement, boolean>;
