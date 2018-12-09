import Vue from 'vue'
import Vuex from 'vuex'
// import the vuex modules
import account from './modules/account'
import lesson from './modules/lesson'

const debug = process.env.NODE_ENV !== 'production'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    account,
    lesson
  },
  strict: debug
})