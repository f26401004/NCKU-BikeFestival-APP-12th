<template>
  <Page>
    <ActionBar>
      <StackLayout width="100%">
        <Label text="Lesson"  horizontalAlignment="center"/>
      </StackLayout>
    </ActionBar>
    <StackLayout>
      <Label v-bind:text="`目前狀態：${$store.getters.getUserLessonStatus ? '修課中': '選課中'}`"></Label>
    </StackLayout>
  </Page>
</template>

<script>
export default {
  components: {
  }
}
</script>

<style>
  ActionBar {
    background-color: #53ba82;
    color: #ffffff;
  }
</style>
