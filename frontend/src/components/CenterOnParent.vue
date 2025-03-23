<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';

@Component({
  name: 'CenterOnParent',
  components: {},
})
export default class CenterOnParent extends Vue {
}
</script>

<template>
  <div class="w-100 h-100 d-flex justify-content-center">
    <div class="align-self-center">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
</style>
