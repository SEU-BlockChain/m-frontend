import {createStore} from 'vuex'

export default createStore({
  state: {
    is_init: false,
    is_login: false,
    login: null,
    user: null,
    hide_top: false,
    message: null,
  },
  mutations: {
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
