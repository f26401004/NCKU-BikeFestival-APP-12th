<template>
    <Page>
        <ActionBar>
            <GridLayout width="100%" columns="auto, *">
                <Label text="MENU" @tap="$refs.drawer.nativeView.showDrawer()" col="0"/>
                <Label class="title" text="12th NCKU-BikeFestival-APP"  col="1"/>
            </GridLayout>
        </ActionBar>

        <RadSideDrawer ref="drawer">
            <StackLayout ~drawerContent backgroundColor="#ffffff">
                <Label class="drawer-header" text="Drawer"/>

                <Label class="drawer-item" text="Item 1"/>
                <Label class="drawer-item" text="Item 2"/>
                <Label class="drawer-item" text="Item 3"/>
                <Label class="drawer-item" :text="$store.getters.getAuthUser"/>
            </StackLayout>

            <GridLayout ~mainContent columns="*" rows="*">
                <Label class="message" :text="msg" col="0" row="0"/>
                <StackLayout>
                    <Button class="button" text="test"></Button>
                </StackLayout>
            </GridLayout>
        </RadSideDrawer>
    </Page>
</template>

<script>
  export default {
    data() {
      return {
        msg: '12th NCKU Bike Festival'
      }
    }
  }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    .title {
        text-align: left;
        padding-left: 16;
    }

    .message {
        vertical-align: center;
        text-align: center;
        font-size: 20;
        color: #333333;
    }

    .drawer-header {
        padding: 50 16 16 16;
        margin-bottom: 16;
        background-color: #53ba82;
        color: #ffffff;
        font-size: 24;
    }

    .drawer-item {
        padding: 8 16;
        color: #333333;
        font-size: 16;
    }

    .button {
        background-color: white;
        border: 1px solid #DDD;
    }
</style>
