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

      // 🔹 localStorage にも保存
      localStorage.setItem('session', JSON.stringify({
        sessionId,
        userId,
        userName,
        expiresAt,
        headerColor,
        backgroundColor
      }))
    },
    clearSession(state) {
      state.sessionId = null
      state.userId = null
      state.userName = null
      state.expiresAt = null

      // 🔹 localStorage から削除
      localStorage.removeItem('session')
    },
    setHeaderColor(state, color) {
      state.headerColor = color
      // 🔹 localStorage 更新
      const session = JSON.parse(localStorage.getItem('session') || '{}')
      session.headerColor = color
      localStorage.setItem('session', JSON.stringify(session))
    },
    setBackgroundColor(state, color) {
      state.backgroundColor = color
      // 🔹 localStorage 更新
      const session = JSON.parse(localStorage.getItem('session') || '{}')
      session.backgroundColor = color
      localStorage.setItem('session', JSON.stringify(session))
    }
  },
  actions: {
    logout({ commit }) {
      commit('clearSession')
    },
    restoreSession({ commit }) {
      // 🔹 リロード時に localStorage から復元
      const session = JSON.parse(localStorage.getItem('session') || 'null')
      if (session && session.sessionId) {
        commit('setSession', session)
      }
    }
  },
  modules: {},
})
