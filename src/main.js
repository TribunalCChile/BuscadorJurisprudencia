import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import Toast from "vue-toastification";
import Skeleton from 'vue-loading-skeleton';
import { iconsSet as icons } from '@/assets/icons'
import DocsExample from '@/components/DocsExample'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import "vue-toastification/dist/index.css";
import "vue-loading-skeleton/dist/style.css"


const app = createApp(App)
app.use(store)
app.use(router)
app.use(CoreuiVue)
app.use(Toast)
app.use(Skeleton)
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('DocsExample', DocsExample)
app.component('v-select', vSelect); 

app.mount('#app')
