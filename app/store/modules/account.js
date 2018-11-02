const state = {
  authUser: 'test'
}

const getters = {
  getAuthUser: (state, getters) => {
    return state.authUser
  }
}

const mutations = {
  'SET_USER': (state, username) => {
    state.authUser = username
  }
}

const actions = {
  login: ({commit, state}, data) => {
    // TODO: login logic.
  }
}

export default {
  namespace: true,
  state,
  getters,
  mutations,
  actions
}