<template>
  <div class="animation-wrap">
    <img class="login-back" :src="this.$settings.cos_url+ 'static/login-back.webp'"/>
    <div class="bar clear-fix">
      <var-icon class="left" color="white" size="30px" name="window-close" @click="this.$router.return('/')"/>
      <div class="bar-text right" @click="this.$router.push('/sign-up')">注册</div>
    </div>

    <div class="tabs">
      <var-tabs color="rgba(0,0,0,0)" v-model:active="active">
        <var-tab class="tab">账号密码登录</var-tab>
        <var-tab class="tab">手机快捷登录</var-tab>
      </var-tabs>
    </div>

    <div class="input">
      <var-tabs-items v-model:active="active">
        <var-tab-item>
          <username placeholder="用户名" v-model:username="username"/>
          <password v-model:password="password"/>
        </var-tab-item>
        <var-tab-item>
          <phone placeholder="手机号" v-model:phone="phone"/>
          <msg-code v-model:code="code" method="login" :phone="phone"/>
        </var-tab-item>
      </var-tabs-items>

      <var-button type="primary" block :disabled="!is_valid" @click="login">登录</var-button>
      <div class="right forget" @click="this.$router.push('reset-password')">忘记密码?</div>
    </div>
  </div>
</template>

<script>
  import Username from "components/input/Username";
  import Phone from "components/input/Phone";
  import Password from "components/input/Password";
  import MsgCode from "components/input/MsgCode";

  export default {
    name: "Login",
    components: {
      Username,
      Phone,
      Password,
      MsgCode,
    },
    data() {
      return {
        active: 0,
        re_pattens: this.$settings.re_pattens,

        phone: "",
        code: "",
        username: "",
        password: "",
      }
    },
    computed: {
      is_valid() {
        if (this.active) {
          if (this.re_pattens.phone.test(this.phone) && this.re_pattens.code.test(this.code)) {
            return true
          }
        } else {
          if (this.re_pattens.username.test(this.username) && this.re_pattens.password.test(this.password)) {
            return true
          }

        }
      }
    },
    methods: {
      login() {
        this.$request.api.post(
          "user/sign/login/",
          {
            username: this.active ? this.phone : this.username,
            password: this.active ? this.code : this.password
          }
        ).then(res => {
          if (res.data.code === 103) {
            this.$tip({
              content: "登录成功",
              type: "success",
              duration: 1000,
            })
            this.$cookies.set("token", res.data.result.user.token)
            this.$store.commit("login", res.data.result["user"])
            if (this.$route.query.back) {
              this.$router.return()
            } else {
              this.$router.replace(this.$route.query.next || "/")
            }
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
        }).catch(err => {
          this.$tip({
            content: err,
            type: "error",
            duration: 2000,
          })
        })
      }
    }
  }
</script>

<style scoped>
  .login-back {
    width: 100vw;
    height: 40vw;
    opacity: .9;
    vertical-align: bottom;
  }

  .bar {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    padding: 20px;
  }

  .bar-text {
    color: white;
    font-size: 20px;
    line-height: 30px;
  }

  .input {
    margin: 10px 30px;
  }

  .tabs {
    width: 250px;
    font-weight: bold;
    --tabs-padding: 0;
  }

  .forget {
    color: #4ebaee;
    margin: 20px 5px;
    font-size: 14px;
  }
</style>