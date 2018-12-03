import Vue from 'nativescript-vue'
import Vuex from 'vuex'
import MainPage from './components/Main.vue'
import LoginPage from './components/Login.vue'
import VueDevtools from 'nativescript-vue-devtools'
const Application = require('tns-core-modules/application')
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

// register exit event to update online info
if (Application.android) {
  Application.android.on(Application.AndroidApplication.activityStartedEvent, function (args) {
    // TODO: update online info to true if login
    
  })
  Application.android.on(Application.AndroidApplication.activityStoppedEvent, function (args) {
    // TODO: update online info to false if login
    
  })
} else {
  const CustomDelegate = (function (_user) {
    __extends(CustomDelegate, _super)
    function CustomDelegate () {
      _super.apply(this, arguments)
    }
    CustomDelegate.prototype.applicationWillResignActive = function (application) {
      // TODO: update online info to false
    }
    CustomDelegate.prototype.applicationWillEnterForeground = function (application) {
      // TODO: update online info to true
    }
  })(UIResponder)
  Applicaiton.ios.delegate = CustomDelegate
}

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
