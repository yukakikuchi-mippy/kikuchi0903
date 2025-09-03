import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sessionId: null,
    userId: null,
    userName: null,
    expiresAt: null,
    headerColor: "pink lighten-2",
    backgroundColor: "white"
  },
  getters: {
    isLoggedIn: (state) => !!state.sessionId,
    currentUser: (state) => ({
      id: state.userId,
      name: state.userName,
      headerColor: state.headerColor,
      backgroundColor: state.backgroundColor
    }),
    sessionExpiresAt: (state) => state.expiresAt,
    isSessionValid: (state) => {
      if (!state.expiresAt) return false
      return new Date(state.expiresAt) > new Date()
    },
  },
  mutations: {
    setSession(state, { sessionId, userId, userName, expiresAt, headerColor, backgroundColor }) {
      state.sessionId = sessionId
      state.userId = userId
      state.userName = userName
      state.expiresAt = expiresAt || null
      state.headerColor = headerColor || "pink lighten-2"
      state.backgroundColor = backgroundColor || "white" 
    },
    clearSession(state) {
      state.sessionId = null
      state.userId = null
      state.userName = null
      state.expiresAt = null
    },
    setHeaderColor(state, color) {
      state.headerColor = color
    },
    setBackgroundColor(state, color) {
      state.backgroundColor = color
    }
  },
  actions: {
    logout({ commit }) {
      commit('clearSession')
    },
  },
  modules: {},
})
