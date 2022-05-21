<template>
  <div class="animation-wrap">
    <var-icon class="back" size="40px" name="chevron-left" @click="this.$router.return()"/>
    <div class="title">重置密码</div>

    <var-steps :active="active">
      <var-step>确认账号</var-step>
      <var-step>重置密码</var-step>
      <var-step>重置成功</var-step>
    </var-steps>

    <div class="input-wrap">
      <div v-if="active===0">
        <phone v-model:phone="phone"/>
        <msg-code v-model:code="code" method="reset_password" :phone="phone"/>
      </div>

      <div v-if="active===1">
        <var-input placeholder="电话号码" :line="false" disabled v-model="phone"/>
        <br>
        <password placeholder="新密码" v-model:password="password"/>
        <password placeholder="确认密码" v-model:password="confirm_password" :confirm="password"/>
      </div>

      <div v-if="active===2">
        <var-icon class="success" size="100px" color="green" name="check-circle-outline"/>
        <div style="text-align: center">修改完成，{{t}}秒后跳转到登陆页</div>
      </div>

      <br>
      <var-button v-if="active<2" type="primary" block @click="next">下一步</var-button>
    </div>
  </div>
</template>

<script>
  import Username from "components/input/Username";
  import Phone from "components/input/Phone";
  import Password from "components/input/Password";
  import MsgCode from "components/input/MsgCode";

  export default {
    name: "ResetPassword",
    components: {
      Phone,
      MsgCode,
      Password,
      Username
    },
    data() {
      return {
        active: 0,
        phone: "",
        code: "",
        password: "",
        confirm_password: "",
        re_pattens: this.$settings.re_pattens,
        t: 5
      }
    },
    methods: {
      next() {
        switch (this.active) {
          case 0:
            if (!this.re_pattens.phone.test(this.phone)) return
            if (!this.re_pattens.code.test(this.code)) return
            this.validate_code()
            break
          case 1:
            if (!this.re_pattens.password.test(this.password)) return
            if (!this.re_pattens.password.test(this.confirm_password)) return
            if (this.password !== this.confirm_password) return
            this.reset_password()
            let inter = setInterval(() => {
              if (this.t === 1) {
                this.$router.push({path: "/login", query: {next: this.$route.query.next}})
                clearInterval(inter)
              }
              this.t--
            }, 1000)
            break
        }
      },
      validate_code() {
        this.$request.api.get(
          "common/code/",
          {
            params: {
              phone: this.phone,
              method: "reset_password",
              code: this.code
            }
          },
        ).then(res => {
          if (res.data.code !== 110) {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          } else {
            this.active++
          }
        }).catch(err => {
          this.$tip({
            content: err,
            type: "error",
            duration: 2000,
          })
        })
      },
      reset_password() {
        this.$request.api.post(
          "user/sign/reset_password/",
          {
            phone: this.phone,
            code: this.code,
            password: this.password,
            confirm_password: this.confirm_password
          }
        ).then(res => {
          if (res.data.code === 104) {
            window.localStorage.removeItem("token")
            this.$store.commit("logout")
            this.active++
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

  .title {
    margin: 25px;
    font-size: 25px;
    font-weight: bold;
  }

  .input-wrap {
    padding: 20px 40px;
  }

  .success {
    margin: 20px calc(50vw - 90px);
  }
</style>