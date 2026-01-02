//v-resize
import type {Directive, DirectiveBinding} from 'vue';
import type {DirectiveHook} from '@vue/runtime-core';

export type ResizeEvent = { blockSize: number, inlineSize: number };

export type ResizeCallback = (event: ResizeEvent) => {}

const onResize = (targetEl: HTMLElement, el: ResizeObserverEntry[], fn: ResizeCallback) => {
  el.filter(e => e.target === targetEl)
    .forEach(e => fn(e.contentBoxSize[0]));
};

const addListener: DirectiveHook<HTMLElement, any, ResizeCallback> =
  (el: HTMLElement, binding: DirectiveBinding<ResizeCallback>) => {
    (el as any).$resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[], observer: ResizeObserver) => onResize(el, entries, binding.value));
    (el as any).$resizeObserver.observe(el);
  };

const removeListener: DirectiveHook<HTMLElement, any, ResizeCallback> =
  (el: HTMLElement, binding: DirectiveBinding<ResizeCallback>) => {
    (el as any).$resizeObserver.unobserve(el);
    (el as any).$resizeObserver.disconnect();
  };

export const Resize = {
  mounted: addListener,
  beforeUnmount: removeListener,
} as Directive<HTMLElement, ResizeCallback>;