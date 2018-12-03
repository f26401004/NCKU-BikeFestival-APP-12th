<template>
  <Page>
    <ActionBar>
      <StackLayout width="100%">
        <Label text="Achievement"  horizontalAlignment="center"/>
      </StackLayout>
    </ActionBar>
    <ScrollView>
      <StackLayout>
        <GridLayout v-for="(iter, index) of missions" v-bind:key="index" columns="auto, *" rows="20, 20, 20, *">
          <Label :text="iter.Name" col="0" row="0"> </Label>
          <Label :text="iter.Description" col="1" row="1"></Label>
          <Label :text="iter.Hint" col="1" row="2"></Label>
          <StackLayout col="1" row="3">
            <Label> 獎勵 ： </Label>
            <Label v-for="(reward, rIndex) of iter.Rewards" v-bind:key="rIndex" :text="reward"></Label>
          </StackLayout>
        </GridLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
  import Firebase from 'nativescript-plugin-firebase'
  export default {
    data: function () {
      return {
        missions: [],
        db: Firebase.firestore
      }
    },
    mounted: async function () {
      try {
        const result = await this.db.collection('missions').get()
        result.docs.forEach(doc => {
          this.missions.push(doc.data())
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
</script>

<style>

</style>
