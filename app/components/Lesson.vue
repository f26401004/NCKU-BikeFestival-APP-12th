<template>
  <Page>
    <ActionBar>
      <StackLayout width="100%">
        <Label text="Lesson"  horizontalAlignment="center"/>
      </StackLayout>
    </ActionBar>
    <StackLayout>
      <Label v-bind:text="`目前狀態：${$store.getters.getUserLessonStatus ? '修課中': '選課中'}`"></Label>
      <GridLayout columns="*, *, *, *, *" rows="24px">
        <Label row="0" col="0" v-bind:text="`語文 ${$store.getters.getUserLessonAttr.language}`"></Label>
        <Label row="0" col="1" v-bind:text="`人文 ${$store.getters.getUserLessonAttr.humanity}`"></Label>
        <Label row="0" col="2" v-bind:text="`邏輯 ${$store.getters.getUserLessonAttr.logic}`"></Label>
        <Label row="0" col="3" v-bind:text="`自然 ${$store.getters.getUserLessonAttr.nature}`"></Label>
        <Label row="0" col="4" v-bind:text="`通識 ${$store.getters.getUserLessonAttr.general}`"></Label>
      </GridLayout>
      <GridLayout columns="*, *" rows="60px">
        <Button row="0" col="0" text="選擇領域修課" @tap="$navigateTo(choosePage)"/>
        <Button row="0" col="1" text="開始修課" @tap="startLearn()"/>
      </GridLayout>
      <Label text="目前課表如下"></Label>
      <ScrollView>
        <StackLayout>
        
          <Label v-for="iter of currentSyllabus" v-bind:key="iter.Lid" v-bind:text="iter.Name"></Label>
        
        </StackLayout>
      </ScrollView>  
    </StackLayout>
  </Page>
</template>

<script>
  import ChoosePage from './LessonChoose.vue'
  export default {
    data: function () {
      return {
        currentSyllabus: [],
        choosePage: ChoosePage
      }
    },
    mounted: function () {
      const allLesson = this.$store.getters.getUserLessonOnGoing
      for (let type of Object.keys(allLesson)) {
        this.currentSyllabus = this.currentSyllabus.concat(allLesson[type])
      }
    },
    methods: {
      startLearn: function () {

      }
    }
  }
</script>

<style scoped>
  ActionBar {
    background-color: #53ba82;
    color: #ffffff;
  }

</style>
