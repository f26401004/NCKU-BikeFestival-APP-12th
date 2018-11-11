<template>
  <Page actionBarHidden="true">
    <login-page v-if="!$store.getters.getUserUID"></login-page>
    <main-page v-if="$store.getters.getUserUID"></main-page>
  </Page>
</template>

<script>
import MainPage from './Main.vue'
import LoginPage from './Login.vue'
export default {
  components: {
    MainPage,
    LoginPage
  }
}
</script>

<style>

</style>
