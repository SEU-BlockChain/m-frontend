<template>
  <div class="wrap">
    <div class="head">
      <div class="line"/>
      <img class="logo" src="~assets/img/ETH.svg" alt="">
      <div class="line"/>
    </div>

    <div class="title">以太坊账号登陆</div>
    <var-divider/>


    <var-space size="20" style="width: 100%;" direction="column">
      <a-input v-model="address" size="large" placeholder="请输入以太坊地址" allow-clear/>
      <a-input-password v-model="password" size="large" placeholder="请输入密码" allow-clear/>
    </var-space>

    <var-space size="0" style="width: 100%;" direction="column">
      <div style="height: 10px;"/>
      <var-radio icon-size="20" class="radio" v-model="remember_address">记住地址</var-radio>
      <var-radio icon-size="20" class="radio" v-model="remember_password">记住密码<span style="color: red;">(不推荐勾选)</span>
      </var-radio>

      <var-button class="button" type="primary" block @click="login">登陆</var-button>

      <var-space style="width: 100%;" justify="space-around" align="center">
        <div class="tip" @click="to_register">生成账户</div>
        <div class="tip" @click="this.$emit('readOnly')">游客模式</div>
      </var-space>
    </var-space>

  </div>
</template>

<script>
  export default {
    name: "Login",
    emits: [
      "onLogin",
      "readOnly"
    ],
    data() {
      return {
        address: "",
        password: "",
        remember_address: false,
        remember_password: false,
        wallet: this.$store.state.wallet
      }
    },
    methods: {
      to_register() {
        this.$store.commit("eth_login", false)
        this.$router.push("/eth/register")
      },
      login() {
        if (!this.wallet.web3.utils.isAddress(this.address)) {
          this.$tip({
            content: `请输入20位公钥`,
            type: "warning",
            duration: 2000
          })
          return
        }
        this.wallet.web3.eth.personal.unlockAccount(this.address, this.password, err => {
          if (err) {
            this.$tip({
              content: `登陆失败:${err.message}`,
              type: "warning",
              duration: 5000
            })
          } else {
            if (this.remember_address) {
              window.localStorage.setItem("address", this.address)
            } else {
              window.localStorage.removeItem("address")
            }

            if (this.remember_password) {
              window.localStorage.setItem("password", this.password)
            } else {
              window.localStorage.removeItem("password")
            }

            if (this.remember_address) {
              window.localStorage.setItem("remember_address", "1")
            } else {
              window.localStorage.removeItem("remember_address")
            }

            if (this.remember_password) {
              window.localStorage.setItem("remember_password", "1")
            } else {
              window.localStorage.removeItem("remember_password")
            }

            this.$emit("onLogin", this.address)
          }
        })
      }
    },
    created() {
      let address = window.localStorage.getItem("address")
      let password = window.localStorage.getItem("password")
      if (address) this.address = address
      if (password) this.password = password

      let remember_address = window.localStorage.getItem("remember_address")
      let remember_password = window.localStorage.getItem("remember_password")
      if (remember_address === "1") this.remember_address = true
      if (remember_password === "1") this.remember_password = true
    }
  }
</script>

<style scoped>
  .wrap {
    width: 80vw;
    max-height: 70vh;
    overflow-y: scroll;
    padding: 10px 20px 30px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
  }

  .head {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .line {
    margin: 10px;
    height: 3px;
    width: 20vw;
    background-color: #4ebaee;
    border-radius: 1px;
  }

  .logo {
    width: 40px;
  }

  .title {
    margin: 10px;
    font-size: 18px;
    font-family: Number, "85W", sans-serif;
  }

  .button {
    margin: 20px 0;
  }

  .tip {
    color: #4ebaee;
  }
</style>