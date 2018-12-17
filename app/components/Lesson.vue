<template>
  <Page>
    <ActionBar>
      <StackLayout width="100%">
        <Label text="Lesson"  horizontalAlignment="center"/>
      </StackLayout>
    </ActionBar>
    <AbsoluteLayout>
      <StackLayout left="0" top="0" height="1920px" width="1080px">
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
        
        <Label text="目前課表如下" horizontalAlignment="center"></Label>
        <Label v-bind:text="`共 ${currentSyllabus.length * 2} 學分，預計需要花 ${currentSyllabus.length * 2} 分鐘修課`"  
          horizontalAlignment="center"/>
        <ScrollView>
          <StackLayout>
            <WrapLayout v-for="iter of currentSyllabus" v-bind:key="iter.Lid">
              <Label v-bind:text="iter.Name"></Label>
              <Progress v-bind:value="iter.Loading" maxValue="5" width="100%"></Progress>
            </WrapLayout>
          </StackLayout>
        </ScrollView>  
      </StackLayout>
      <AbsoluteLayout v-show="question.status" left="0" top="0" width="1080px" height="1920px" class="black_background">
        <StackLayout left="100px" width="880px">
          <Label v-bind:text="question.title" horizontalAlignment="center"></Label>
          <Button v-for="(iter, index) of question.options" v-bind:key="index" v-bind:text="iter" @tap="chooseOption(index)"></Button>
        </StackLayout>
      </AbsoluteLayout>
    </AbsoluteLayout>
    
  </Page>
</template>

<script>
  //const LocalNotifications = require('nativescript-local-notifications')
  import { LocalNotificationsImpl as LocalNotifications } from "nativescript-local-notifications"
  const Dialogs = require("tns-core-modules/ui/dialogs")
  const Timer = require("tns-core-modules/timer");
  import ChoosePage from './LessonChoose.vue'
  export default {
    data: function () {
      return {
        choosePage: ChoosePage,
        currentProgress: 0,
        question: {
          status: false,
          title: '',
          options: [],
          answer: 0,
          success: false
        },
        lessonTimer: null
      }
    },
    mounted: async function () {
      try {
        const self = this
        // set the message received callback event.
        await LocalNotifications.prototype.addOnMessageReceivedCallback(
          async function(notificationData) {
            console.log(this)
            console.log(self)
            Timer.clearInterval(self.lessonTimer)
            // show question to user.
            await self.showLessonQuestion()
          }
        )
        console.log(LocalNotifications)
        const ids = await LocalNotifications.prototype.getScheduledIds()
        console.log(ids)
      } catch (error) {
        console.log(error)
      }


    },
    computed: {
      currentSyllabus: function () {
        let result = []
        const allLesson = this.$store.getters.getUserLessonOnGoing
        for (let type of Object.keys(allLesson)) {
          result = result.concat(allLesson[type])
        }
        return result
      },
    },
    methods: {
      showLessonQuestion: async function () {
        try {
          console.log('test')
          const result = await this.$store.dispatch('getLessonQuestion', this.currentSyllabus[this.currentProgress])
          this.question.status = true
          this.question.title = result.Title
          this.question.options = result.Options
          this.question.answer = result.Answer
        } catch (error) {
          console.log(error)
        }
      },
      chooseOption: async function (index) {
        if (index === this.question.answer) {
          console.log('success finish the lesson')
          // TODO: update the lesson to database
          // add to the local state.
          this.$store.commit('ADD_LESSON_FINISHED', this.currentSyllabus[this.currentProgress])
        } else {
          console.log('failed finish the lesson')
          Dialogs.alert({
            title: `修課失敗：${this.currentSyllabus[this.currentProgress].Name}`,
            message: `失敗為成功之母，下次再加油！`,
            okButtonText: "確認"
          })
        }

        // reset the question data
        this.question.status = false
        this.question.title = ''
        this.question.options = []
        this.question.answer = 0
        Dialogs.alert({
          title: `修課完畢：${this.currentSyllabus[this.currentProgress].Name}`,
          message: `恭喜你成功修得 ${this.currentSyllabus[this.currentProgress].Type} 2 學分`,
          okButtonText: "確認"
        })
        // add attribute
        const lessonFinish = {}
        lessonFinish[this.currentSyllabus[this.currentProgress].Type.toLowerCase()] = 2
        this.$store.commit('ADD_LESSON_ATTRIBUTE', lessonFinish)
        // add finish lesson to database and local
        await this.$store.dispatch('addFinishLesson', this.currentSyllabus[this.currentProgress])
        this.$store.commit('ADD_LESSON_FINISHED', this.currentSyllabus[this.currentProgress])
        // if lesson learning all finish.
        if (this.currentProgress === this.currentSyllabus.length - 1) {
          // cancel the local notification.
          await LocalNotifications.prototype.cancel(1)
          // change status
          this.$store.commit('SET_LESSON_STATUS', false)
          // erase all ongoing lesson.
          this.$store.commit('REMOVE_ALL_LESSON_ONGOING')
          this.currentProgress = 0
          return
        }
            
        // TODO: update finish lesson information to database
        this.currentProgress++
        //this.$store.getters.getUserLessonSpanLesson
        await LocalNotifications.prototype.schedule([{
          id: 1,
          title: this.currentSyllabus[this.currentProgress].Name,
          body: `恭喜你成功修得 ${this.currentSyllabus[this.currentProgress].Name} 2 學分`,
          ticker: 'The ticker',
          badge: 1,
          groupedMessages: [`在這堂中你獲得了 ${this.currentSyllabus[this.currentProgress].Type} 的知識`, `保持積極向上的心成為一個優秀的大學生吧！`],
          groupSummary: '12th 成大單車節 修課系統公告', //android only
          ongoing: true, // makes the notification ongoing (Android only)
          thumbnail: true,
          channel: 'LessonChannel',
          forceShowWhenInForeground: true,
          at: new Date(new Date().getTime() + 8 * 1000) // 10 seconds from now
        }])
        // restart timer to count the progress status
        this.lessonTimer = Timer.setInterval(() => {
          this.currentSyllabus[this.currentProgress].Loading++
        }, 1000)

      },
      startLearn: async function () {
        if (this.$store.getters.getUserLessonStatus) {
          console.log('You are under learning!')
          return
        }
        if (this.currentSyllabus.length === 0) {
          console.log('There is no lesson to learn!')
          return
        }
        this.currentProgress = 0
        console.log(this.currentSyllabus[this.currentProgress].Type)
        // start learning and update the data to database.
        await this.$store.dispatch('learningNow')
        this.$store.commit('SET_LESSON_STATUS', true)
        // local notification start
        await LocalNotifications.prototype.schedule([{
          id: 1,
          title: `修課完畢：${this.currentSyllabus[this.currentProgress].Name}`,
          body: `恭喜你成功修得 ${this.currentSyllabus[this.currentProgress].Name} 2 學分`,
          ticker: 'The ticker',
          badge: 1,
          groupedMessages: [`在這堂中你獲得了 ${this.currentSyllabus[this.currentProgress].Type} 的知識`, `保持積極向上的心成為一個優秀的大學生吧！`],
          groupSummary: '12th 成大單車節 修課系統公告', //android only
          ongoing: true, // makes the notification ongoing (Android only)
          thumbnail: true,
          channel: 'LessonChannel',
          forceShowWhenInForeground: true,
          at: new Date(new Date().getTime() + 5 * 1000) // 10 seconds from now
        }])
        // start timer to count progress status
        this.lessonTimer = Timer.setInterval(() => {
          this.$store.commit('ADD_LESSON_PROGRESS', this.currentSyllabus[this.currentProgress])
        }, 1000)
      }
    }
  }
</script>

<style scoped>
  ActionBar {
    background-color: #53ba82;
    color: #ffffff;
  }
  .black_background {
    background-color: rgba(0, 0, 0, 0.66);
  }
</style>
