import {createStore} from 'vuex'

export default createStore({
  state: {
    wallet: null,
    is_init: false,
    is_login: false,
    login: null,
    user: null,
    hide_top: false,
    message: null,
    forbid_back: 0,
    show_eth_login: false,
    image_preview: {
      show: false,
      images: []
    },
    stack: [],
    stack_locked: 0
  },
  mutations: {
    pushStack(state, callback) {
      state.stack.push(callback)
    },
    popStack(state) {
      state.stack.pop()()
      state.stack_locked++
    },
    unlockStack(state) {
      state.stack_locked--
    },
    cancelStack(state) {
      state.stack.pop()
    },
    clearStack(state) {
      state.stack_locked = 0
      state.stack = []
    },
    set_image_preview(state, images) {
      state.image_preview.images = images
      state.image_preview.show = true
    },
    close_image_preview(state) {
      state.image_preview.show = false
    },
    eth_login(state, show) {
      state.show_eth_login = show
    },
    web3(state, wallet) {
      state.wallet = wallet
    },
    toggle_hide(state) {
      state.hide_top = !state.hide_top
    },
    initialize(state, login) {
      state.login = login
      state.is_init = true
    },
    login(state, user, login) {
      state.is_login = true
      state.user = user
      state.login = login
    },
    message(state, message) {
      state.message = message
    },
    message_clear(state, type) {
      if (state.message) {
        state.message[type] = 0
      }
    },
    logout(state) {
      state.is_login = false
      state.login = null
      state.user = null
    },
  },
  actions: {},
  modules: {}
})
