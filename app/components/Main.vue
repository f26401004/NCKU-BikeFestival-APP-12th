<template>
  <Page>
    <ActionBar>
      <GridLayout width="100%" columns="auto, *">
        <Label text="MENU" @tap="$refs.drawer.nativeView.showDrawer()" col="0"/>
        <Label class="title" text="Main Page"  col="1"/>
      </GridLayout>
    </ActionBar>
    <RadSideDrawer ref="drawer">
      <StackLayout ~drawerContent backgroundColor="#ffffff">
        <Label class="drawer-header" text="Drawer"/>
        <Label class="drawer-item" text="QR Code" @tap="$navigateTo(scannerPage)"/>
        <Label class="drawer-item" text="Sponsor" @tap="$navigateTo(sponsorPage)"/>
        <Label class="drawer-item" text="Message" @tap="$navigateTo(messagePage)"/>
        <Label class="drawer-item" text="Map" @tap="$navigateTo(mapPage)"/>
      </StackLayout>
      <AbsoluteLayout ~mainContent>
        <StackLayout top="0" width="100%">
          <Label ref="name" horizontalAlignment="center"> Hello, {{this.$store.getters.getUsername}} </Label>
          <Image class="profile" :src="$store.getters.getUserProfilePic" stretch="fill" />
        </StackLayout>
        <Image class="gray-background" top="500"/>
      </AbsoluteLayout>
    </RadSideDrawer>
  </Page>
</template>

<script>
  const ApplicationSettings = require('tns-core-modules/application-settings')
  import firebase from 'nativescript-plugin-firebase'
  import SponsorPage from './Sponsor.vue'
  import ScannerPage from './Scanner.vue'
  import MessagePage from './Message.vue'
  import MapPage from './Map.vue'
  import LoginPage from './Login.vue'
  export default {
    data: function () {
      return {
        sponsorPage: SponsorPage,
        scannerPage: ScannerPage,
        messagePage: MessagePage,
        mapPage: MapPage
      }
    },
    mounted: async function () {
      const result = await firebase.getCurrentUser()
      if (result) {
        this.$store.dispatch('login', result)
      }
    },
    methods: {
    }
  }
</script>

<style scoped>

  .profile {
    width: 1000px;
    height: 1000px;
    border-radius: 1000px;
  }

  .title {
    text-align: left;
    padding-left: 16;
  }

  .gray-background {
    width: 1080px;
    height: 200px;
    background-color: gray;
  }

  .drawer-header {
    padding: 50 16 16 16;
    margin-bottom: 16;
    background-color: #53ba82;
    color: #ffffff;
    font-size: 24;
  }

  .drawer-item {
    padding: 8 16;
    color: #333333;
    font-size: 16;
  }

</style>
