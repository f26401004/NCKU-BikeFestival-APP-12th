<template>
  <Page>
    <ActionBar>
      <StackLayout width="100%">
        <Label text="Message"  horizontalAlignment="center"/>
        <GridLayout v-for="(iter, index) of messages" v-bind:key="index" col="auto, *">
          <Label :text="iter.Name" col="0"></Label>
          <Label :text="iter.Value" col="1"></Label>
        </GridLayout>
      </StackLayout>
    </ActionBar>
    <StackLayout>

    </StackLayout>
  </Page>
</template>

<script>
const admin = require('firebase-admin')
const functions = require('firebase-functions')
admin.initializeApp(functions.config().firebase)
var db = admin.firestore()

export default {
  data: function () {
    return {
      messages: []
    }
  },
  created: async function () {
    try {
      // TODO: fetch the message from firestore.
      // const result = await db.collection('messages').get()
      // this.messages = result
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<style scoped>

</style>
