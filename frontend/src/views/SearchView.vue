<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import CardSearch from "@/components/search/CardSearch.vue";

@Component({
  components: {
    CardSearch
  },
})
export default class SearchView extends Vue {
}
</script>

<template>
  <CardSearch />
</template>
