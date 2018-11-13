import Vue from 'nativescript-vue'
import Vuex from 'vuex'
import App from './components/App.vue'
import MainPage from './components/Main.vue'
import LoginPage from './components/Login.vue'
import VueDevtools from 'nativescript-vue-devtools'
const Applicaiton = require('tns-core-modules/application')
const ApplicationSettings = require('tns-core-modules/application-settings')
// import Firebase
import Firebase from 'nativescript-plugin-firebase'

// import store
import store from './store/index'


if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

// register rad side drawer
Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer)
// register barcode scanner
Vue.registerElement('MLKitBarcodeScanner', () => require('nativescript-plugin-firebase/mlkit/barcodescanning').MLKitBarcodeScanner)
Vue.use(Vuex)
Vue.prototype.$store = store

// test for application event.
Applicaiton.on(Applicaiton.launchEvent, args => {
  console.log('Root View: ' + args.root)
})

// initialize firebase
Firebase.init({
  persist: true,
  onAuthStateChanged: function (data) {
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
  render: h => h('frame', [h(ApplicationSettings.getString('userUID') ? MainPage : LoginPage)])
}).$start()
