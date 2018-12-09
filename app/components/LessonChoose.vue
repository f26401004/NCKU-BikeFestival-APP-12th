<template>
  <Page>
    <ActionBar>
      <StackLayout width="100%">
        <Label text="Choose Lesson"  horizontalAlignment="center"/>
      </StackLayout>
    </ActionBar>

      <TabView @selectedIndexChange="fetchLesson">
        <TabViewItem v-for="(iter, index) of tabsEName" v-bind:key="iter" v-bind:title="tabsCName[index]">
          <ScrollView>
            <StackLayout>
            <Button v-for="lesson of allLesson[iter.toLowerCase()]" v-bind:key="lesson.Lid" v-bind:class="{unable: checkLesson(lesson.Lid)}" v-bind:text="lesson.Name"/>
            </StackLayout>
          </ScrollView>
        </TabViewItem>
      </TabView>

  </Page>
</template>

<script>
  const Application = require('tns-core-modules/application')
  const FrameModule = require("ui/frame")
  export default {
    data: function () {
      return {
        tabsEName: ['Language', 'Humanity', 'Logic', 'Nature', 'General'],
        tabsCName: ['語文', '人文', '邏輯', '自然', '通識'],
        allLesson: {
          language: [],
          humanity: [],
          logic: [],
          nature: [],
          general: []
        }
      }
    },
    mounted: function () {
    },
    methods: {
      fetchLesson: async function (event) {
        if (this.allLesson[this.tabsEName[event.value].toLowerCase()].length > 0) {
          return
        }
        try {
          const currentTabLesson = await this.$store.dispatch('getLessonByType', this.tabsEName[event.value])
          currentTabLesson.forEach(target => {
            target.Type = this.tabsEName[this.currentIndex]
          })
          this.allLesson[this.tabsEName[event.value].toLowerCase()] = currentTabLesson
        } catch (error) {
          console.log(error)
        }
        
      },
      checkLesson: function (lid) {
        for (let type of Object.keys(this.$store.getters.getUserLessonOnGoing)) {
          const lessons = this.$store.getters.getUserLessonOnGoing[type]
          return (lessons.find(target => target.Lid === lid)) ? true : false
        }
      }
    }
  }
</script>

<style scoped>
  ActionBar {
    background-color: #53ba82;
    color: #ffffff;
  }
  .unable {
    background-color: #999;
  }
</style>
