<template>
  <div class="animation-wrap" v-if="message">
    <router-view v-slot="{ Component }">
      <keep-alive :include="['Home','Community','Dynamic','Message','Profile']">
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
        :badge="badge1"
      />

      <var-bottom-navigation-item
        label="消息" icon="message-processing-outline" @click="this.$router.push('/message')"
        :badge="badge2"
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
        active: 0,
        animation: "",
        message: this.$store.state.message
      }
    },
    watch: {
      $route(to, from) {
        this.animation = this.animate(to, from)
      }
    },
    computed: {
      badge1() {
        let num = this.message.dynamic
        if (num) {
          return {type: 'danger', value: num}
        } else {
          return false
        }
      },
      badge2() {
        let message = this.message
        let num = message["like"] + message["at"] + message["private"] + message["system"] + message["reply"]
        if (num) {
          return {type: 'danger', value: num}
        } else {
          return false
        }
      }
    },
    methods: {
      change_active(index) {
        this.active = index
      },
      animate(to, from) {
        if (to.meta.depth === from.meta.depth) return ""
        return to.meta.order > from.meta.order ? "steady-left" : "right-steady"
      },
    },
    created() {
      if (this.$store.state.message) {
        this.message = this.$store.state.message
      } else {
        this.$request.api.get(
          "user/self/message/"
        ).then(res => {
          this.message = res.data.result
          this.$store.commit("message", res.data.result)
        })
      }
    }
  }
</script>

<style scoped>
  .bottom-fixed {
    position: fixed;
    width: 100vw;
    left: 0;
    bottom: 0;
  }
</style>