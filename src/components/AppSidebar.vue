<template>
  <CSidebar
    class="border-end"
    colorScheme="dark"
    position="fixed"
    :unfoldable="sidebarUnfoldable"
    :visible="sidebarVisible"
    @visible-change="
      (event) =>
        $store.commit({
          type: 'updateSidebarVisible',
          value: event,
        })
    "
  >
    <CSidebarHeader class="border-bottom">
      <RouterLink custom to="/" v-slot="{ href, navigate }">
        <CSidebarBrand v-bind="$attrs" as="a" :href="href" @click="navigate">
          <CImage align="center" custom-class-name="sidebar-brand-full" :src="logoTC" rounded  width="150"/>
<!--           <CIcon custom-class-name="sidebar-brand-full" :icon="logo" :height="40" />
 -->          
          <!-- <CIcon custom-class-name="sidebar-brand-full" :icon="logoTC" :height="32" /> -->
          
        </CSidebarBrand>
      </RouterLink>
      <CCloseButton class="d-lg-none" dark @click="$store.commit('toggleSidebar')" />
    </CSidebarHeader>
    <AppSidebarNav />
    <CSidebarFooter class="border-top d-none d-lg-flex">
      <CSidebarToggler @click="$store.commit('toggleUnfoldable')" />
    </CSidebarFooter>
  </CSidebar>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useStore } from 'vuex'
import { AppSidebarNav } from './AppSidebarNav'
import { logo } from '@/assets/brand/logo'
import  logoTC  from '@/assets/brand/tc-gris.webp' 
//import  logoTC  from '@/assets/brand/tc-negro.webp'
import { sygnet } from '@/assets/brand/sygnet'
import axios from 'axios'; 

export default {
  name: 'AppSidebar',
  components: {
    AppSidebarNav,
    RouterLink,
  },
  setup() {
    const store = useStore();
	 
    return {
      logo,
      sygnet,
      logoTC,
      sidebarUnfoldable: computed(() => store.state.sidebarUnfoldable),
      sidebarVisible: computed(() => store.state.sidebarVisible),
    }
  },
}
</script>
