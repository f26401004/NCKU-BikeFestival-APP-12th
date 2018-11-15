<template>
  <Page>
    <ActionBar>
      <StackLayout width="100%">
        <Label text="Message"  horizontalAlignment="center"/>
      </StackLayout>
    </ActionBar>
    <AbsoluteLayout>
      <ScrollView>
        <StackLayout left="0" top="0">
          <GridLayout v-for="(iter, index) of messages" v-bind:key="index" columns="auto, *">
            <Label col="0"> {{iter.Name}} </Label>
            <Label :text="iter.Value" col="1"></Label>
          </GridLayout>
        </StackLayout>
      </ScrollView>
      <GridLayout left="0" top="500" columns="*, auto">
        <TextField ref="textField" hint="發送點什麼吧！" col="0" v-model="text"></TextField>
        <Button text="送出" col="1" @tap="submit" returnKeyType="send"></Button>
      </GridLayout>
    </AbsoluteLayout>
  </Page>
</template>

<script>
  import Firebase from 'nativescript-plugin-firebase'
  import { Page } from 'tns-core-modules/ui/page/page'
  export default {
    data: function () {
      return {
        text: '',
        messages: [],
        messageObserver: null,
        db: Firebase.firestore
      }
    },
    mounted: async function () {
      // register snapshot event to refresh data.
      this.db.collection('messages').onSnapshot(snapshot => {
        this.messages = []
        snapshot.forEach(doc => {
          // TODO: need to filter out the scope.
          if (doc.data().Scope === 'all') {
            this.messages.push(doc.data())
          } 
        })
        this.messages.sort((a, b) => {
          return new Date(a.Time) - new Date(b.Time)
        })
      })
    },
    methods: {
      submit: function () {
        if (this.text === '') {
          return
        }
        // TODO: filter out some danger/warning string.
        // TODO: need to determine the scope based on the current object.
        // send the message to the firestore.
        this.db.collection('messages').add({
          UID: this.$store.getters.getUserUID,
          Name: this.$store.getters.getUsername,
          Scope: 'all',
          Time: new Date().toUTCString(),
          Value: this.text
        })
        // close the keyboard and delete original text
        this.text = ""
        this.$refs.textField.nativeView.dismissSoftInput()
      }
    }
  }
</script>

<style scoped>
  TextField {
    width: 260;
  }
</style>
