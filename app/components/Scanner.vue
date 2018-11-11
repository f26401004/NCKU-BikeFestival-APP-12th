<template>
  <Page xmlns:FirebaseMLKitBarcodeScanner="nativescript-plugin-firebase/mlkit/barcodescanning">>
    <MLKitBarcodeScanner 
      width="800"
      height="800"
      formats="QR_CODE, EAN_8, EAN_13"
      preferFrontCamera="false"
      [torchOn]="torchOn"
      (scanResult)="onBarcodeScanningResult($event)"/>
  </Page>
</template>

<script>
  export default {
    data: function () {
      return {
      }
    },
    mounted: function () {
      console.log('test')
    },
    methods: {
      onBarcodeScanningResult: function (result) {
        console.log(result)
      }
    }
  }
</script>

<style>

</style>
