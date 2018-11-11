const state = {
  uid: '',
  username: '',
  userProfilePicUrl: ''
}

const getters = {
  getUserUID: (state, getters) => {
    return state.uid
  },
  getUsername: (state, getters) => {
    return state.username
  },
  getUserProfilePic: (state, getters) => {
    return state.userProfilePicUrl
  }
}

const mutations = {
  'SET_UID': (state, uid) => {
    state.uid = uid
  },
  'SET_USERNAME': (state, username) => {
    state.username = username
  },
  'SET_USER_PROFILEPIC': (state, url) => {
    state.userProfilePicUrl = url
  }
}

const actions = {
  login: ({commit, state}, data) => {
    // store the user information
    commit('SET_UID', data.uid)
    commit('SET_USERNAME', data.name)
    if (data.providers[1].id.indexOf('facebook') > -1) {
      commit('SET_USER_PROFILEPIC', data.profileImageURL + '?width=1000&height=1000')
    } else if (data.providers[1].id.indexOf('google') > -1) {
      commit('SET_USER_PROFILEPIC', data.profileImageURL)
    }
  }
}

export default {
  namespace: true,
  state,
  getters,
  mutations,
  actions
}