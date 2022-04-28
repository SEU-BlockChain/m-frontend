<template>
  <div style="height: 80px;width: 100%">
    <var-input
      clearable
      :placeholder="placeholder || '验证码'"
      :rules="this.$settings.validators.code"
      v-model="code"
      @input="$emit('update:code',code)"
      blur-color="#bbb"
    >
      <template #append-icon>
        <div>
          <div class="text" v-show="is_send" disabled type="info">{{t}}s</div>
          <div class="text" :class="{active:this.$settings.re_pattens.phone.test(phone)}" v-show="!is_send" type="info"
               @click="getCode">获取验证码
          </div>
        </div>
      </template>
    </var-input>

  </div>
</template>

<script>
  export default {
    name: "msgCode",
    props: {
      placeholder: null,
      code: null,
      phone: null,
      method: null,
    },
    emits: ["update:code"],
    data() {
      return {
        t: 60,
        is_send: false
      }
    },
    methods: {
      getCode() {
        if (!this.$settings.re_pattens.phone.test(this.phone.toString())) return

        this.$request.api.get(
          "common/code/",
          {
            params: {
              phone: this.phone,
              method: this.method,
            }
          },
        ).then(res => {
          if (res.data.code !== 101) {
            this.$tip({
              content: res.data.result.errmsg ? res.data.result.errmsg : res.data.msg,
              type: "warning",
              duration: 1000,
            })
          } else {
            this.$tip({
              content: "验证码已发送",
              type: "success",
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

        this.is_send = true
        let inter = setInterval(() => {
          if (this.t <= 0) {
            clearInterval(inter)
            this.is_send = false
            this.t = 60
          } else {
            this.t--
          }
        }, 1000)
      }
    }
  }
</script>

<style scoped>
  .text {
    color: #bbb;
    font-size: 16px;
    width: 120px;
    text-align: right;
  }

  .active {
    color: #4ebaee;
  }
</style>