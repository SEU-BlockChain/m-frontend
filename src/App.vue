<template>
  <div class="background"/>

  <router-view v-if="this.$store.state.is_init" v-slot="{ Component }">
    <Transition @after-enter="to_top" :name="animation">
      <keep-alive :include="include">
        <component :is="Component" :key="this.$route.fullPath"/>
      </keep-alive>
    </Transition>
  </router-view>
  <var-loading class="center" v-else/>

  <var-back-top v-if="!this.$store.state.hide_top" bottom="70px" right="15px" :duration="300"/>

  <div>
    <var-popup style="border-radius: 5px;" @click-overlay="read_only" v-model:show="show_eth_login">
      <eth-login @onLogin="eth_login" @readOnly="read_only"/>
    </var-popup>
  </div>

  <image-preview/>
</template>

<script>
  import EthLogin from "./components/eth/EthLogin";
  import ImagePreview from "./components/fullScreen/ImagePreview";

  export default {
    name: "app",
    components: {ImagePreview, EthLogin},
    watch: {
      "$store.state.show_eth_login"(newValue, oldValue) {
        this.show_eth_login = newValue
      },
      show_eth_login(newValue, oldValue) {
        this.$store.commit("eth_login", newValue)
      },
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
        init: null,
        wallet: null,
        show_eth_login: false,
      }
    },

    methods: {
      read_only() {
        this.show_eth_login = false
        this.$tip({
          content: "正在以只读模式浏览",
          type: "success"
        })
      },
      animate(to, from) {
        if (to.meta.depth === from.meta.depth) return ""
        return to.meta.depth > from.meta.depth ? "steady-left" : "right-steady"
      },
      to_top() {
        if (this.$route.meta.keepAlive && this.$route.name !== this.init) return
        window.scrollTo(0, 0)
      },
      eth_login(address) {
        this.show_eth_login = false
        this.wallet.getAccount(address)
      }
    },
    beforeCreate() {
      let token = window.localStorage.getItem("token")
      if (token) {
        let login = this.$request.api.get(
          "user/self/info/"
        ).then(res => {
          let response = res
          if (res.data.code === 107) {
            this.$request.api.get(
              "user/self/message/"
            ).then(res => {
              this.$store.commit("message", res.data.result)
              this.$store.commit("login", response.data.result.user)
            })
            return new Promise(resolve => {
              resolve()
            })
          } else {
            window.localStorage.removeItem("token")
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
    beforeMount() {
      let that = this
      document.addEventListener('plusready', function () {
        var webview = plus.webview.currentWebview();
        plus.key.addEventListener('backbutton', function () {
          webview.canBack(function (e) {
            if (that.$store.state.stack.length) {
              that.$store.commit("popStack")
            } else if (e.canBack && that.$route.meta.depth !== 0) {
              webview.back();
            } else if (that.$route.meta.depth === 0) {
              let first = null;
              plus.key.addEventListener('backbutton', function () {
                //首次按键，提示‘再按一次退出应用’
                if (that.$route.meta.depth === 0) {
                  if (!first) {
                    first = new Date().getTime();
                    that.$tip({
                      content: "再返回一次退出应用",
                      type: "info",
                      duration: 1000,
                    })
                    setTimeout(function () {
                      first = null;
                    }, 1000);
                  } else {
                    if (new Date().getTime() - first < 1500) {
                      plus.runtime.quit();
                    }
                  }
                }
              }, false);
            }
          })
        });
      });
    },
    created() {
      this.wallet = new this.$eth.Wallet()
      this.wallet.init_wallet().then(address => {
        if (!address) {
          this.show_eth_login = true
        }
      })
      this.$store.commit("web3", this.wallet)
      document.addEventListener("click", e => {
        let is_w_container = false
        for (let i of e.path) {
          try {
            if (i.getAttribute("id") === "app") break;
            if (i.classList.contains("w-container")) {
              is_w_container = true
              break
            }
          } catch (e) {

          }
        }

        if (is_w_container) {
          for (let i of e.path) {
            if (i.getAttribute("id") === "app") break;
            if (i.getAttribute("data-w-e-type") === "link-card") {
              let url = i.getAttribute("data-link")
              if (url.startsWith("/")) {
                this.$router.push(url)
              } else {
                try {
                  plus.runtime.openURL(url);
                  e.preventDefault()
                } catch (e) {
                  window.open(url)
                }
              }
            }
          }
        }

        if (e.target.tagName === "A") {
          if (e.target.href.startsWith("/")) {
            this.$router.push(e.target.href)
          } else {
            try {
              plus.runtime.openURL(e.target.href);
              e.preventDefault()
            } catch (e) {
              window.open(url)
            }
          }
        }
      })
    }
  }
</script>

<style>
  @import "assets/css/base.css";
</style>
