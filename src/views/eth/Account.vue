<template>
  <div class="animation-wrap">
    <var-app-bar
      class="app-bar"
      color="white"
      text-color="#333"
      title-position="center"
    >
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
      <template #default>
        <div class="title">我的账户</div>
      </template>
    </var-app-bar>
    <div style="height: 54px"/>

    <div v-if="wallet.address" class="wrap">
      <var-card class=" card">
        <template #extra>
          <var-space direction="column" size="large" style="padding: 15px;">
            <var-space direction="column" size="mini" align="center" justify="start">
              <div class="text">地址/公钥</div>
              <div>{{wallet.address}}</div>
            </var-space>
            <var-space direction="column" size="mini" align="center" justify="start">
              <div class="text">SEUB余额</div>
              <div>{{wallet.SEUB}}</div>
            </var-space>
            <var-space direction="column" size="mini" align="center" justify="start">
              <div class="text">PMB余额</div>
              <div>{{wallet.PMB}}</div>
            </var-space>
          </var-space>
        </template>
      </var-card>

      <div class="btn-wrap">
        <var-space direction="column">
          <var-button class="button" type="danger" block @click="logout">退出登陆</var-button>
        </var-space>
      </div>
    </div>
    <div class="center" v-else>未登录</div>
  </div>
</template>

<script>
  export default {
    name: "Account",
    data() {
      return {
        wallet: this.$store.state.wallet,
      }
    },
    methods: {
      logout() {
        this.$dialog("是否退出当前账号").then(res => {
          if (res === "confirm") {
            this.wallet.logout()
          }
        })
      }
    }
  }
</script>

<style scoped>
  .btn-wrap {
    margin: 15px;
  }

  .app-bar {
    width: 100vw;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
  }

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
  }

  .wrap {
    margin: 5px;
  }


  .text {
    font-size: 18px;
    font-weight: 600;
  }
</style>