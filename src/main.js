import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import cookies from 'vue-cookies'

import Snackbar from "@varlet/ui/es/snackbar";
import Dialog from "@varlet/ui/es/dialog";

import request from "./assets/js/request";
import settings from "./assets/js/settings";

const app = createApp(App)

app.config.globalProperties.$settings = settings
app.config.globalProperties.$request = request
app.config.globalProperties.$cookies = cookies
app.config.globalProperties.$tip = Snackbar
app.config.globalProperties.$dialog = Dialog

app.use(store)
app.use(router)
app.mount('#app')

import '@varlet/ui/es/dialog/style/index.js'
import '@varlet/ui/es/snackbar/style/index.js'
import 'default-passive-events'