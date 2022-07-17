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
    remove: {
      article: [],
      comment: [],
    }
  },
  mutations: {
    web3(state, wallet) {
      state.wallet = wallet
    },
    remove(state, payload) {
      state.remove[payload.type].push(payload.id)
    },
    lock(state) {
      state.forbid_back += 1
    },
    unlock(state) {
      state.forbid_back -= 1
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
