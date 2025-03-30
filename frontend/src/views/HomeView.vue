<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import Dashboard from "@/components/dashboard/Dashboard.vue";

@Component({
  name: 'MainView',
  components: {
    Dashboard
  },
})
export default class MainView extends Vue {
}
</script>

<template>
  <Dashboard class="m-2"/>
</template>
