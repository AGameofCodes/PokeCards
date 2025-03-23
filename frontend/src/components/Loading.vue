<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import CenterOnParent from '@/components/CenterOnParent.vue';
import Spinner from '@/components/Spinner.vue';

@Component({
  name: 'Loading',
  components: {
    CenterOnParent,
    Spinner,
  },
})
export default class Loading extends Vue {
}
</script>

<template>
  <CenterOnParent>
    <Spinner/>
  </CenterOnParent>
</template>
