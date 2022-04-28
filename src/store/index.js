import {createStore} from 'vuex'

export default createStore({
  state: {
    is_init: false,
    is_login: false,
    login: null,
    user: null,
  },
  mutations: {
    initialize(state, login) {
      state.is_init = true
      state.login = login
    },
    login(state, user) {
      state.is_login = true
      state.user = user
    },
    logout(state) {
      state.is_login = false
      state.user = null
    },
  },
  actions: {},
  modules: {}
})
