import Vue from 'nativescript-vue'
import App from './components/App'
import VueDevtools from 'nativescript-vue-devtools'
// import Firebase
import Firebase from 'nativescript-plugin-firebase'
// import store
import store from './store/index'


if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer)
Vue.prototype.$store = store

// initialize firebase
Firebase.init({
  onAuthStateChanged: data => {
    console.log((data.loggedIn ? "Logged in to firebase" : "Logged out from firebase") + " (init's onAuthStateChanged callback)")
  }
}).then (
  () => {
    console.log('Firebase is ready')
  },
  error => {
    console.log(error)
  }
)

new Vue({
  store,
  render: h => h('frame', [h(App)])
}).$start()
