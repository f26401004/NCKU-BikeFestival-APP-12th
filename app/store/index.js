import Vue from 'vue'
import Vuex from 'vuex'
// import the vuex modules
import account from './modules/account'

const debug = process.env.NODE_ENV !== 'production'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    account
  },
  strict: debug
})