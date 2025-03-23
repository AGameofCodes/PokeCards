//v-visible
import type {Directive, DirectiveBinding} from 'vue';
import type {DirectiveHook} from '@vue/runtime-core';

const update: DirectiveHook<HTMLElement,  any, boolean> =
  (el: HTMLElement, binding: DirectiveBinding<boolean>) => {
    el.style.visibility = binding.value ? '' : 'hidden';
  };

export const Visible = {
  mounted: update,
  updated: update,
} as Directive<HTMLElement, boolean>;