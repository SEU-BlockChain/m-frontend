<template>
  <div class="background"/>

  <router-view v-if="this.$store.state.is_init" v-slot="{ Component }">
    <Transition @after-enter="to_top" :name="animation">
      <keep-alive :include="include">
        <component :is="Component"/>
      </keep-alive>
    </Transition>
  </router-view>

  <var-loading class="center" v-else/>

  <var-back-top v-if="!this.$store.state.hide_top" bottom="70px" right="15px" :duration="300"/>
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

        this.init = null
        if (to.meta.keepAlive) {
          if (this.include.indexOf(to.name) === -1) {
            this.init = to.name
            this.include.push(to.name);
          }
        }

        if (from.meta.keepAlive && to.meta.depth < from.meta.depth) {
          let index = this.include.indexOf(from.name);
          index !== -1 && this.include.splice(index, 1);
        }

        if (from.name === 'Article' && to.name === "PostArticle") {
          let index = this.include.indexOf(from.name);
          index !== -1 && this.include.splice(index, 1);
        }

      }
    },
    data() {
      return {
        include: ["UserDetailWrap", "IndexWrap"],
        animation: "",
        init: null
      }
    },
    methods: {
      animate(to, from) {
        if (to.meta.none || from.meta.none) return ""
        if (to.meta.depth === from.meta.depth) return ""
        return to.meta.depth > from.meta.depth ? "steady-left" : "right-steady"
      },
      to_top() {
        if (this.$route.meta.keepAlive && this.$route.name !== this.init) return
        window.scrollTo(0, 0)
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
            let message = this.$request.api.get(
              "user/self/message/"
            ).then(res => {
              this.$store.commit("message", res.data.result, message)
            })
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
