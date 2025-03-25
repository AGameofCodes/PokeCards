<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import CardSearch from "@/components/search/CardSearch.vue";

@Component({
  name: 'MainView',
  components: {
    CardSearch
  },
})
export default class MainView extends Vue {
}
</script>

<template>
  <CardSearch />
</template>
