<template>
  <Page>
    <ActionBar>
      <StackLayout width="100%">
        <Label class="title" text="12th NCKU-BikeFestival-APP"  horizontalAlignment="center"/>
      </StackLayout>
    </ActionBar>
    <GridLayout ~mainContent columns="*" rows="*">
      <Label class="message" :text="msg" col="0" row="0"/>
      <StackLayout>
        <Button class="button" text="FACEBOOK LOGIN" @tap="facebookLogin"></Button>
        <Button class="button" text="GOOGLE LOGIN" @tap="googleLogin"></Button>
      </StackLayout>
    </GridLayout>
  </Page>
</template>

<script>
  const ApplicationSettings = require('tns-core-modules/application-settings')
  import firebase from 'nativescript-plugin-firebase'
  import MainPage from './Main.vue'
  export default {
    data: function () {
      return {
        msg: '12th NCKU Bike Festival'
      }
    },
    methods: {
      facebookLogin: async function () {
        try {
          const result = await firebase.login({
            type: firebase.LoginType.FACEBOOK
          })
          // write user info in application settings
          ApplicationSettings.setString('userUID', result.uid)
          this.$store.dispatch('login', result)
          this.$navigateTo(MainPage)
        } catch (error) {
          console.log(error)
        }
      },
      googleLogin: async function () {
        try {
          const result = await firebase.login({
            type: firebase.LoginType.GOOGLE
          })
          // write user info in application settings
          ApplicationSettings.setString('userUID', result.uid)
          this.$store.dispatch('login', result)
          this.$navugateTo(MainPage)
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
</script>

<style scoped>
    .title {
        text-align: left;
        padding-left: 16;
    }

    .message {
        vertical-align: center;
        text-align: center;
        font-size: 20;
        color: #333333;
    }

    .button {
        background-color: white;
        border: 1px solid #DDD;
    }
</style>
