<template>
  <Page>
    <AbsoluteLayout>
      <Label text="" left="190px" top="446px" class="rect"></Label>
      <Label text="⌜" left="176px" top="386px"></Label>
      <Label text="⌝" left="856px" top="386px"></Label>
      <Label text="⌞" left="176px" top="1000px"></Label>
      <Label text="⌟" left="856px" top="1000px"></Label>
      <MLKitBarcodeScanner 
        class="scanner-round"
        formats="QR_CODE, EAN_8, EAN_13"
        beepOnScan="true"
        reportDuplicates="true"
        processEveryNthFrame="5"
        preferFrontCamera="false"
        torchOn="false"
        @scanResult="onBarcodeScanningResult"/>
    </AbsoluteLayout>
  </Page>
</template>

<script>
  export default {
    data: function () {
      return {
      }
    },
    methods: {
      onBarcodeScanningResult: function (event) {
        const code = event.value.barcodes[0]
        if (code) {
          console.log(code.value)
        }
      }
    }
  }
</script>

<style scoped>
  Label {
    color: white;
    font-size: 48px;
    z-index: 999;
  }
  .rect {
    width: 726px;
    height: 726px;
    border-width: 2px;
    border-color: rgba(255, 255, 255, 0.6);
  }
  .scanner-round {
    width: 100%;
    height: 100%;
  }
</style>
