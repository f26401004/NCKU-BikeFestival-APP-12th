const Firebase = require('nativescript-plugin-firebase')
const Applicaiton = require('tns-core-modules/application')
const ApplicationSettings = require('tns-core-modules/application-settings')

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
  login: async ({commit, state}, type) => {
    try {
      const result = await Firebase.login({
        type: type
      })
      ApplicationSettings.setString('userUID', result.uid)
      // store the user information
      commit('SET_UID', result.uid)
      commit('SET_USERNAME', result.name)
      if (type === 'facebook') {
        commit('SET_USER_PROFILEPIC', result.profileImageURL + '?width=1000&height=1000')
      } else if (type === 'google') {
        commit('SET_USER_PROFILEPIC', result.profileImageURL)
      }
      console.log('test')
      // register new user to database.
      const register = Firebase.functions.httpsCallable('newUser')
      await register({
        uid: result.uid,
        username: result.name
      })
      // update online info to true
      const online = Firebase.functions.httpsCallable('onlineRefresh')
      await online({
        uid: result.uid,
        value: 1
      })
      console.log('success')
    } catch (error) {
      console.log(error)
    }
  },
  regainUser: async ({commit, state}) => {
    try {
      const result = await Firebase.getCurrentUser()
      const type = result.providers[1].id
      console.log(type)
      // store the user information
      commit('SET_UID', result.uid)
      commit('SET_USERNAME', result.name)
      if (type === 'facebook.com') {
        commit('SET_USER_PROFILEPIC', result.profileImageURL + '?width=1000&height=1000')
        console.log(state.userProfilePicUrl)
      } else if (type === 'google.com') {
        commit('SET_USER_PROFILEPIC', result.profileImageURL)
      }
      // update online info to true
      const online = Firebase.functions.httpsCallable('onlineRefresh')
      await online({
        uid: result.uid,
        value: 1
      })
      console.log('success')
    } catch (error) {
      console.log(error)
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