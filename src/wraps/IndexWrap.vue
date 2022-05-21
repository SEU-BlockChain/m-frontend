<template>
  <div class="animation-wrap">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" @active="change_active"/>
      </keep-alive>
    </router-view>

    <var-bottom-navigation class="bottom-fixed var-elevation--12" v-model:active="active">

      <var-bottom-navigation-item
        label="首页" icon="home-outline" @click="this.$router.push('/home')"
      />

      <var-bottom-navigation-item
        label="社区" icon="map-marker-radius-outline" @click="this.$router.push('/community')"
      />

      <var-bottom-navigation-item
        label="动态" icon="bell-outline" @click="this.$router.push('/dynamic')"
        :badge="Boolean(this.$store.state.message?.dynamic)&&{type: 'primary', value: this.$store.state.message?.dynamic}"
      />

      <var-bottom-navigation-item
        label="消息" icon="message-processing-outline" @click="this.$router.push('/message')"
      />

      <var-bottom-navigation-item
        label="我的" icon="account-circle-outline" @click="this.$router.push('/profile')"
      />

    </var-bottom-navigation>
  </div>
</template>

<script>
  export default {
    name: "IndexWrap",
    data() {
      return {
        active: 0
      }
    },
    methods: {
      change_active(index) {
        this.active = index
      }
    }
  }
</script>

<style scoped>
  .bottom-fixed {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
  }
</style>