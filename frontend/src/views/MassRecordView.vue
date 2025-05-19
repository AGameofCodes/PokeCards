<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import MassRecord from '@/components/massRecord/MassRecord.vue';

@Component({
  components: {
    MassRecord,
  },
})
export default class MassRecordView extends Vue {
}
</script>

<template>
  <MassRecord class="p-2"/>
</template>
