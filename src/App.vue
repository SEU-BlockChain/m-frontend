<template>
  <div class="background"/>
  <router-view v-if="this.$store.state.is_init"/>
  <var-loading class="center" v-else/>
  <var-back-top bottom="70px" right="15px" :duration="300"/>
</template>

<script>
  export default {
    name: "app",
    watch: {
      $route(to, from) {
        if (to.path === "/login") {
          if (from.path !== "/sign-up") {
            this.animation = "steady-up"
          } else {
            this.animation = "right-steady"
          }
        } else if (from.path === "/login") {
          if (to.path !== "/sign-up") {
            this.animation = "down-steady"
          } else {
            this.animation = "steady-left"
          }
        } else {
          this.animation = this.animate(to, from)
        }
      }
    },
    data() {
      return {
        animation: ""
      }
    },
    methods: {
      animate(to, from) {
        if (to.meta.depth === from.meta.depth) return ""
        return to.meta.depth > from.meta.depth ? "steady-left" : "right-steady"
      }
    },
    beforeCreate() {
      let token = this.$cookies.get("token")
      if (token) {
        let login = this.$request.api.get(
          "user/self/info/"
        ).then(res => {
          if (res.data.code === 107) {
            this.$store.commit("login", res.data.result.user)
            return new Promise(resolve => {
              resolve()
            })
          } else {
            this.$cookies.remove("token")
            return new Promise((resolve, reject) => {
              reject(res.data.msg)
            })
          }
        }).catch(err => {
          this.$tip({
            content: err,
            type: "error",
            duration: 2000,
          })
          return new Promise((resolve, reject) => {
            reject(err)
          })
        })
        this.$store.commit("initialize", login)
      } else {
        this.$store.commit("initialize", null)
      }
    },
  }
</script>

<style>
  @import "assets/css/base.css";
</style>
