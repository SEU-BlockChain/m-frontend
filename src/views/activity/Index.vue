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
          @click="this.$router.return('/community')"
        >
          <var-icon name="chevron-left" :size="24"/>
        </var-button>
      </template>
      <template #default>
        <div class="bar-text">
          活动
        </div>
      </template>
    </var-app-bar>
    <div style="height: 54px;"/>
    <div class="title">第一届预测大赛</div>
    <div v-if="wallet.address">
      <div class="address">
        <span>{{this.$calc.filters.simple_address(wallet.address)}}</span>
        <span style="margin-left: 20px;color:#05b16a" v-if="signed===true">已参赛</span>
        <span style="margin-left: 20px;color:red" v-if="signed===false">未参赛</span>
      </div>
      <div style="display: flex;justify-content: center;padding-top: 20px;align-items: center;flex-direction: column">
        <var-button type="success" @click="get_SEUB">领取SEUB</var-button>
        <br>

        <var-button type="success" v-if="signed===true" @click="transfer">领取参赛代币</var-button>

        <var-button type="success" v-if="signed===false" @click="add">报名比赛</var-button>
      </div>
    </div>
    <div v-else>
      <div class="title">请先登陆以太坊账号</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "IndexActivity",
    watch: {
      "$store.state.wallet.address"() {
        this.$request.api.get(`/common/sign/signed?address=${this.wallet.address}`).then(res => {
          if (res.data.code !== 100) {
            this.$tip({
              content: res.data.msg,
              type: "warning"
            })
          } else {
            this.signed = res.data.result.signed
          }
        })
      }
    },
    data() {
      return {
        wallet: this.$store.state.wallet,
        signed: undefined
      }
    },
    methods: {
      get_SEUB() {
        this.$request.api.get(`/common/eth/withdraw?address=${this.wallet.address}`).then(res => {
          this.$tip({
            content: res.data.msg === "成功" ? "已获取1SEUB" : res.data.msg,
            type: res.data.msg === "成功" ? "success" : "warning"
          })
        })
      },
      add() {
        this.$request.api.get(`/common/sign/add?address=${this.wallet.address}`).then(res => {
          if (res.data.code !== 100) {
            this.$tip({
              content: res.data.msg,
              type: "warning"
            })
          } else {
            this.$tip({
              content: "已报名",
              type: "success"
            })
            this.signed = true
          }
        })
      },
      transfer() {
        this.$request.api.get(`/common/sign/transfer?address=${this.wallet.address}`).then(res => {
          if (res.data.code !== 100) {
            this.$tip({
              content: res.data.msg,
              type: "warning"
            })
          } else {
            this.$tip({
              content: "已经领取10000代币",
              type: "success"
            })
          }
        })
      }
    },
    created() {
      console.log(this.wallet.address);
      if (!this.wallet.address) {
        this.$store.commit("eth_login", true)
      } else {
        this.$request.api.get(`/common/sign/signed?address=${this.wallet.address}`).then(res => {
          if (res.data.code !== 100) {
            this.$tip({
              content: res.data.msg,
              type: "warning"
            })
          } else {
            this.signed = res.data.result.signed
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

  .bar-text {
    font-size: 18px;
    color: #06f;
  }

  .title {
    font-family: Number, "85W", sans-serif;
    margin: 20px 0;
    text-align: center;
    font-size: 24px;
  }

  .animation-wrap {
    background-color: white;
  }

  .address {
    font-size: 12px;
    color: #888888;
    text-align: center;
  }
</style>
