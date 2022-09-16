<template>
  <div class="animation-wrap">
    <var-app-bar class="app-bar" color="white" text-color="#333" title="设置">
      <template #left>
        <var-button
          round
          text
          color="transparent"
          text-color="#333"
          @click="this.$router.return('/profile')"
        >
          <var-icon name="chevron-left" :size="24"/>
        </var-button>
      </template>
    </var-app-bar>
    <div style="height: 64px;"/>

    <div class="option" v-ripple="{ color: '#ccc' }">
      <div class="option-text">版本:Beta1.0.1</div>
      <div v-if="new_version&&new_version>old_version" style="color: red;" @click="download">点击下载新版本!</div>
      <div v-else>已是最新版本</div>
    </div>

    <div v-if="this.$store.state.is_login" class="option" v-ripple="{ color: '#ccc' }"
         @click="this.$router.push('/setting/message')">
      <div class="option-text">消息设置</div>
      <var-icon name="chevron-right"/>
    </div>

    <div v-if="this.$store.state.is_login" class="logout">
      <var-button block type="danger" @click="logout">退出登陆</var-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Setting",
    data() {
      return {
        old_version: [0, 1, 0, 1],
        new_version: null
      }
    },
    methods: {
      logout() {
        this.$dialog({
          message: "确认退出登陆？",
        }).then(res => {
          if (res === "confirm") {
            localStorage.removeItem("token")
            this.$store.commit("logout")
            this.$router.replace("/")
          }
        })
      },
      download() {
        let url = this.$settings.cos_url + "apk/" + `OurChain_${this.new_version.join(".")}.apk`
        try {
          plus.runtime.openURL(url);
          e.preventDefault()
        } catch (e) {
          window.open(url)
        }
      }
    },
    created() {
      this.$request.api.get("/other/info/version").then(res => {
        this.new_version = res.data.result.version
      })
    }
  }
</script>

<style scoped>
  .option {
    display: flex;
    justify-content: space-between;
    width: 100vw;
    background-color: white;
    padding: 15px;
    align-items: center;
    border-bottom: 1px solid #ddd;
    line-height: 20px;
  }

  .option-text {
    font-weight: 500;
  }

  .app-bar {
    width: 100vw;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
  }

  .logout {
    padding: 10px;
  }
</style>
