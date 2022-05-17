<template>
  <div class="background"/>

  <router-view v-if="this.$store.state.is_init" v-slot="{ Component }">
    <Transition name="fade">
      <keep-alive>
        <component :is="Component"/>
      </keep-alive>
    </Transition>
  </router-view>

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
        console.log(this.animation);
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

  .fade-enter-active {
    transition: all 0.3s ease-out;
  }

  .fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .fade-enter-from,
  .fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
  }
</style>
