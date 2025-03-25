<script lang="ts">
import {RouterView} from 'vue-router';
import {Component, Vue} from 'vue-facing-decorator';
import NavBar from '@/components/navbar/NavBar.vue';
import SideBar from '@/components/sidebar/SideBar.vue';
import DocumentLocaleSetter from '@/components/locale/DocumentLocaleSetter.vue';
import LocaleSaver from '@/components/locale/LocaleSaver.vue';

@Component({
  name: 'App',
  components: {
    DocumentLocaleSetter,
    LocaleSaver,
    NavBar,
    RouterView,
    SideBar,
  },
})
export default class App extends Vue {
  sidebarToggled = false;
}
</script>

<template>
  <LocaleSaver/>
  <DocumentLocaleSetter/>
  <div class="h-100 w-100 overflow-hidden">
    <div class="h-100 w-100 d-flex flex-row">
      <SideBar ref="sidebar" class="overflow-hidden flex-shrink-0" style="height: 100vh" :toggled="sidebarToggled"
               @close="sidebarToggled=false"/>
      <div class="flex-grow-1 overflow-hidden">
        <div class="d-flex flex-column w-100 h-100">
          <NavBar class="flex-grow-0" @toggleSidebar="sidebarToggled = !sidebarToggled"></NavBar>
          <RouterView class="flex-grow-1 overflow-hidden"/>
        </div>
      </div>
    </div>
  </div>
</template>
