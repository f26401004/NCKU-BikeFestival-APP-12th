<template>
  <Page>
    <ActionBar>
      <StackLayout width="100%">
        <Label text="Map"  horizontalAlignment="center"/>
      </StackLayout>
    </ActionBar>
      <GridLayout>
        <Mapbox
          accessToken="pk.eyJ1IjoiZjI2NDAxMDA0IiwiYSI6ImNqbjdlbmdocjB6dXcza21zM3Q1bGRrazgifQ.0Q3kVfa1bgrZBtzTMSKhvQ"
          mapStyle="traffic_light"
          latitude="22.999952"
          longitude="120.215047"
          hideCompass="true"
          zoomLevel="15"
          showUserLocation="true"
          disableZoom="false"
          disableRotation="false"
          disableScroll="false"
          disableTilt="false"
          @mapReady="onMapReady($event)">
        </Mapbox>
      </GridLayout>
  </Page>
</template>

<script>
  const Geolocation = require('nativescript-geolocation')
  import { MapboxMarker } from "nativescript-mapbox";
  import { Accuracy } from 'tns-core-modules/ui/enums'
  export default {
    data: function () {
      return {
        map: null
      }
    },
    mounted: async function () {
    },
    methods: {
      onMapReady: async function (args) {
        this.map = args.map
        try {
          await Geolocation.enableLocationRequest()
          if (Geolocation.isEnabled()) {
            const result = await Geolocation.getCurrentLocation({ desiredAccuracy: Accuracy.high, maximumAge: 5000, timeout: 20000 })
            args.map.addMarkers([
              {
                lat: result.latitude,
                lng: result.longitude,
                title: this.$store.getters.getUsername,
                subtitle: "Test subtitle"
              }
            ])
          }
        } catch (error) {
          console.log(error)
        }
        
      }
    }
  }
</script>

<style>

</style>
