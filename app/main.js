import Vue from 'nativescript-vue'
import Vuex from 'vuex'
import MainPage from './components/Main.vue'
import LoginPage from './components/Login.vue'
import VueDevtools from 'nativescript-vue-devtools'
const Application = require('tns-core-modules/application')
const FrameModule = require("ui/frame")
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
// register Mapbox component
Vue.registerElement("Mapbox", () => require("nativescript-mapbox").MapboxView)

Vue.use(Vuex)
Vue.prototype.$store = store


// register resume event to update online info
Application.on(Application.resumeEvent, function (args) {
  if (Vue.prototype.$store.getters.getUserUID) {
    const online = Firebase.functions.httpsCallable('onlineRefresh')
    online({
      uid: Vue.prototype.$store.getters.getUserUID,
      value: 1
    })
  }
})
// register exit event to update online info
Application.on(Application.suspendEvent, function (args) {
  if (Vue.prototype.$store.getters.getUserUID) {
    const online = Firebase.functions.httpsCallable('onlineRefresh')
    online({
      uid: Vue.prototype.$store.getters.getUserUID,
      value: 0
    })
  }
})
Application.on(Application.exitEvent, function (args) {
  if (Vue.prototype.$store.getters.getUserUID) {
    const online = Firebase.functions.httpsCallable('onlineRefresh')
    online({
      uid: Vue.prototype.$store.getters.getUserUID,
      value: 0
    })
  }
})

// initialize firebase
Firebase.init({
  persist: true,
  onAuthStateChanged: async function (data) {
    console.log((data.loggedIn ? "Logged in to firebase" : "Logged out from firebase") + " (init's onAuthStateChanged callback)")
    // update user infomation
    if (data.loggedIn) {
      await Vue.prototype.$store.dispatch('regainUser')
    }
  }
}).then (
  () => {
    console.log('Firebase is ready')
  },
  error => {
    console.log(error)
  }
).catch(error => {
  console.log(error)
})

new Vue({
  render: h => h('frame', [h(ApplicationSettings.getString('userUID') ? MainPage : LoginPage)])
}).$start()
