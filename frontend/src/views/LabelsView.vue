<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import Labels from '@/components/labels/Labels.vue';

@Component({
  name: 'LabelsView',
  components: {Labels},
})
export default class LabelsView extends Vue {
}
</script>

<template>
  <Labels class="m-2"/>
</template>
