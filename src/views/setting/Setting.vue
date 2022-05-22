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

    <div class="option" v-ripple="{ color: '#ccc' }" @click="this.$router.push('/setting/message')">
      <div class="option-text">消息设置</div>
      <var-icon name="chevron-right"/>
    </div>

    <div class="logout">
      <var-button block type="danger" @click="logout">退出登陆</var-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Setting",
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
    },

  }
</script>

<style scoped>
  .banner {
    color: #333333;
    line-height: 20px;
    margin: 10px 5px 0;
    font-size: 12px;
  }

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

  .option-tip {
    color: #666666;
    font-size: 14px;
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