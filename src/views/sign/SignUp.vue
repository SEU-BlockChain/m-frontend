<template>
  <div class="animation-wrap">
    <var-icon class="back" size="40px" name="chevron-left" @click="this.$router.return()"/>
    <div class="title">注册</div>
    <div class="wrap">
      <username placeholder="用户名" v-model:username="username"/>
      <password placeholder="密码" v-model:password="password"/>
      <password placeholder="确认密码" v-model:password="confirm_password" :confirm="password"/>
      <var-button type="primary" block :disabled="!is_valid" @click="register">注册</var-button>
    </div>
  </div>
</template>

<script>

  import Username from "components/input/Username";
  import Password from "components/input/Password";

  export default {
    name: "SignUp",
    components: {
      Password,
      Username
    },
    data() {
      return {
        active: 0,
        re_pattens: this.$settings.re_pattens,

        username: "",
        password: "",
        confirm_password: "",
      }
    },
    computed: {
      is_valid() {
        if (!this.re_pattens.username.test(this.username)) return false
        if (!this.re_pattens.password.test(this.password)) return false
        return this.password === this.confirm_password;
      }
    },
    methods: {
      register() {
        this.$request.api.post(
          "user/sign/register/",
          {
            username: this.username,
            password: this.password,
            confirm_password: this.confirm_password
          }
        ).then(res => {
          if (res.data.code === 102) {
            window.localStorage.setItem("token", res.data.result.user.token)
            this.$store.commit("login", res.data.result.user)
            this.$router.replace(this.$route.query.next || "/")
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
  .back {
    padding: 10px 0;
  }

  .wrap {
    padding: 20px 40px;
  }

  .title {
    margin: 25px;
    font-size: 25px;
    font-weight: bold;
  }
</style>