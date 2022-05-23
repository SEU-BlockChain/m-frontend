import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueXss from 'vue-xss'

import Snackbar from "@varlet/ui/es/snackbar";
import Dialog from "@varlet/ui/es/dialog";

import request from "./assets/js/request";
import calc from "./assets/js/calc";
import settings from "./assets/js/settings";
import tools from "./assets/js/tools";

const app = createApp(App)
app.config.globalProperties.$settings = settings
app.config.globalProperties.$calc = calc
app.config.globalProperties.$request = request
app.config.globalProperties.$tools = tools
app.config.globalProperties.$tip = Snackbar
app.config.globalProperties.$dialog = Dialog
// app.config.globalProperties.$xss = x => x


import {whiteList} from "./assets/js/css_white_list";

app.use(store)
app.use(router)
app.use(VueXss, {
  whiteList,
  css: false
})
app.mount('#app')

import '@varlet/ui/es/dialog/style/index.js'
import '@varlet/ui/es/snackbar/style/index.js'
