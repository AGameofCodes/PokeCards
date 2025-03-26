<script lang="ts">
import {Component, Vue} from 'vue-facing-decorator';
import UserCards from "@/components/usercards/UserCards.vue";

@Component({
  components: {UserCards},
})
export default class UserCardsView extends Vue {
}
</script>

<template>
  <UserCards class="m-2"/>
</template>
