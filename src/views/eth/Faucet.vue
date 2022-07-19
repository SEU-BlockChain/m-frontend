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
        <div class="title">获取虚拟币</div>
      </template>
    </var-app-bar>

    <div style="height: 54px;"/>
    <div  v-if="wallet.address" class="wrap">
      <var-card class=" card">
        <template #extra>
          <var-space direction="column" size="large" style="padding: 15px;">
            测试版功能，每天限获取一次。新账户需要联系管理员激活账户。
            <var-button  class="button" type="success" block @click="get_SEUB">获取SEUB</var-button>
            <var-button class="button" type="success" block @click="get_PMB">获取PMB</var-button>
          </var-space>
        </template>
      </var-card>
    </div>
    <div class="center" v-else>未登录</div>
  </div>
</template>

<script>
  export default {
    name: "Faucet",
    data() {
      return {
        wallet: this.$store.state.wallet,
      }
    },
    methods: {
      get_SEUB() {
        let contract = new this.wallet.web3.eth.Contract(this.$abi.SEUB_FAUCET, this.wallet.SEUB_FAUCET)
        contract.methods.get().send({
          from: this.wallet.address,
        }).on('receipt', res => {
          this.$tip({
            content: "已获取1SEUB",
            type: "success"
          })
        }).on('error', err => {
          if (err.message === "Returned error: execution reverted: -1") {
            this.$tip({
              content: "您今天已经获取了",
              type: "warning"
            })
          } else if (err.message === "Returned error: insufficient funds for transfer") {
            this.$tip({
              content: "请先联系管理员激活账户",
              type: "info"
            })
          }
        })
      },
      get_PMB() {
        let contract = new this.wallet.web3.eth.Contract(this.$abi.PMB_FAUCET, this.wallet.PMB_FAUCET)
        contract.methods.get().send({
          from: this.wallet.address,
        }).on('receipt', res => {
          this.$tip({
            content: "已获取1000PMB",
            type: "success"
          })
        }).on('error', err => {
          if (err.message === "Returned error: execution reverted: -1") {
            this.$tip({
              content: "您今天已经获取了",
              type: "warning"
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
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
</style>