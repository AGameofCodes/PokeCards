<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import Stats from "@/components/dashboard/Stats.vue";

@Component({
  components: {
    Stats,
  },
})
export default class Dashboard extends Vue {
}
</script>

<template>
  <div>
    <div class="row">
      <div class="col-sm-12 col-md-6 col-lg-4">
        <Stats/>
      </div>
    </div>
  </div>
</template>
