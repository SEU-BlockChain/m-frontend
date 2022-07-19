<template>
  <div class="animation-wrap">
    <var-icon class="back" size="40px" name="chevron-left" @click="this.$router.return('/profile')"/>

    <var-space class="wrap" direction="column" justify="start" align="center">
      <div class="head-text">生成以太坊账户</div>
      <a-input-password v-model="password" placeholder="请输入密码" allow-clear/>
      <a-input-password v-model="confirm_password" placeholder="请输入确认密码" allow-clear/>
      <var-button :disabled="!password||!confirm_password" size="small" class="button" type="primary" block
                  @click="create">生成
      </var-button>

      <div class="address" v-if="res">
        <var-space justify="space-between" align="center">
          <div class="tip">以太坊地址:</div>
          <var-icon name="content-copy" @click="copy"/>
        </var-space>
        <div class="hex">{{res}}</div>
      </div>
    </var-space>
    <input id="copy" style="position: fixed;bottom: 200vh">
  </div>
</template>

<script>
  export default {
    name: "Register",
    data() {
      return {
        password: "",
        confirm_password: "",
        res: ""
      }
    },
    methods: {
      copy() {
        let input = document.getElementById("copy");   // js创建一个input输入框
        input.value = this.res;
        input.select();   // 选中输入框中的内容
        document.execCommand("Copy");   // 执行复制操作

        this.$tip({
          content: "已复制地址",
          type: "success"
        })
      },
      create() {
        if (this.password !== this.confirm_password) {
          this.$tip({
            content: "两次密码不一致",
            type: "warning",
            duration: 2000
          })
          return
        }
        this.$store.state.wallet.web3.eth.personal.newAccount(this.password).then(res => {
          this.res = res
        })
      }
    }
  }
</script>

<style scoped>
  .tip {
    font-size: 16px;
    font-family: "85W";
  }

  .animation-wrap {
    background-color: white;
  }

  .back {
    padding: 10px 0;
  }

  .head-text {
    text-align: center;
    font-size: 20px;
    font-family: "85W";
  }

  .wrap {
    margin: 20px;
  }

  .address {
    margin-top: 20px;
    padding: 5px;
    background-color: #f0f1f5;
  }

  .hex {
    margin: 5px;
  }
</style>