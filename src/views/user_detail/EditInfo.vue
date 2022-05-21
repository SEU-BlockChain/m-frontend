<template>
  <div class="animation-wrap">
    <var-app-bar class="app-bar" color="white" :elevation="false" text-color="#333" title="账号资料">
      <template #left>
        <var-button
          round
          text
          color="transparent"
          text-color="#333"
          @click="this.$router.return('/user')"
        >
          <var-icon name="chevron-left" :size="24"/>
        </var-button>
      </template>
    </var-app-bar>

    <div class="wrap">

      <div class="item" @click="this.$router.push('/change-icon')">
        <div class="item-text">头像</div>
        <div class="item-content">
          <img class="avatar" :src="this.$settings.cos_url+user.icon">
          <var-icon size="25" name="chevron-right"/>
        </div>
      </div>
      <var-divider margin="0" inset="10"/>

      <div class="item">
        <div class="item-text">用户ID</div>
        <div class="item-content">
          <div>{{user.id}}</div>
          <div class="space"/>
        </div>
      </div>
      <var-divider margin="0" inset="10"/>

      <div class="item" @click="pop('username')">
        <div class="item-text">用户名</div>
        <div class="item-content">
          <div>{{user.username}}</div>
          <var-icon size="25" name="chevron-right"/>
        </div>
      </div>
      <var-divider margin="0" inset="10"/>


      <div class="item">
        <div class="item-text">注册时间</div>
        <div class="item-content">
          <div>{{user.date_joined.replace("T", " ").substring(0, 10)}}</div>
          <div class="space"/>
        </div>
      </div>
      <var-divider margin="0" inset="10"/>

      <div class="item" @click="pop('phone')">
        <div class="item-text">手机号码</div>
        <div class="item-content">
          <div>{{user.phone||"未绑定"}}</div>
          <var-icon size="25" name="chevron-right"/>
        </div>
      </div>
      <var-divider margin="0" inset="10"/>

      <div class="item" @click="pop('description')">
        <div class="item-text">个性签名</div>
        <div class="item-content">
          <div>{{user.description||"还没有个性签名"}}</div>
          <var-icon size="25" name="chevron-right"/>
        </div>
      </div>
    </div>


    <var-popup style="border-radius: 5px" position="center" v-model:show="show">
      <div class="pop">
        <div class="pop-title">{{title}}</div>
        <div class="pop-body">

          <div v-if="type==='username'">
            <username placeholder="用户名" v-model:username="username"/>
          </div>

          <div v-else-if="type==='phone'">
            <div v-if="this.$store.state.user.phone">
              <phone disabled placeholder="手机号"
                     v-model:phone="this.$store.state.user.phone"/>
              <msg-code v-model:code="code" method="unbind_phone"
                        :phone="this.$store.state.user.phone"/>
            </div>
            <div v-else>
              <phone placeholder="手机号" v-model:phone="phone"/>
              <msg-code v-model:code="code" method="bind_phone" :phone="phone"/>
            </div>
          </div>

          <div v-else-if="type==='description'">
            <var-input placeholder="请输入个性签名" :rules="validators.description" textarea v-model="description"/>
          </div>
        </div>
        <div class="pop-submit">
          <var-button block size="small" :disabled="!is_valid" type="success" @click="submit">
            确定
          </var-button>
        </div>
      </div>
    </var-popup>
  </div>
</template>

<script>
  import Username from "components/input/Username";
  import Phone from "components/input/Phone";
  import MsgCode from "components/input/MsgCode";

  export default {
    name: "EditInfo",
    components: {
      MsgCode,
      Phone,
      Username
    },
    data() {
      return {
        user: this.$store.state.user,
        show: false,
        type: null,
        username: this.$store.state.user.username,
        description: this.$store.state.user.description,
        phone: "",
        code: "",
        re_pattens: this.$settings.re_pattens,
        validators: this.$settings.validators,
      }
    },
    computed: {
      title() {
        return {
          username: "修改用户名",
          phone: this.$store.state.user.phone ? "解除绑定" : "绑定手机",
          description: "编辑个性签名"
        }[this.type]
      },
      is_valid() {
        if (this.type === "username") {
          return this.re_pattens.username.test(this.username) && this.user.username !== this.username
        } else if (this.type === "phone") {
          if (this.$store.state.user.phone) {
            return this.re_pattens.code.test(this.code)
          } else {
            return this.re_pattens.code.test(this.code) && this.re_pattens.phone.test(this.phone)
          }
        } else if (this.type === "description") {
          return this.re_pattens.description.test(this.description) && this.user.description !== this.description
        }
      }
    },
    methods: {
      pop(type) {
        this.type = type
        this.show = true
      },
      submit() {
        let url, data
        if (this.type === "username") {
          url = "user/self/info/"
          data = {
            username: this.username
          }
        } else if (this.type === "phone") {
          url = this.user.phone ? "user/self/unbind_phone/" : "user/self/bind_phone/"
          data = {
            phone: this.$store.state.user.phone || this.phone,
            code: this.code
          }
        } else if (this.type === "description") {
          url = "user/self/info/"
          data = {
            description: this.description
          }
        }
        this.$request.api.post(
          url,
          data
        ).then(res => {
          let error = false
          if (this.type === "username") {
            if (res.data.code === 108) {
              this.user.username = res.data.result.user.username
              window.localStorage.setItem("token", res.data.result.user.token)
              this.$tip({
                content: "用户名更新完成",
                type: "success",
                duration: 1000,
              })
            } else {
              error = true
            }
          } else if (this.type === "phone") {
            if (this.$store.state.user.phone) {
              if (res.data.code === 106) {
                this.user.phone = null
                this.$tip({
                  content: "已解除绑定",
                  type: "success",
                  duration: 1000,
                })
                this.code = ""
              } else {
                error = true
              }
            } else {
              if (res.data.code === 105) {
                this.$store.state.user.phone = this.phone
                this.$tip({
                  content: "已绑定手机",
                  type: "success",
                  duration: 1000,
                })
                this.phone = ""
                this.code = ""
              } else {
                error = true
              }
            }
          }
          if (this.type === "description") {
            if (res.data.code === 108) {
              this.user.description = res.data.result.user.description
              this.$tip({
                content: "个性签名更新完成",
                type: "success",
                duration: 1000,
              })
            } else {
              error = true
            }
          }

          if (error) {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          } else {
            this.show = false
          }
        }).catch(err => {
          this.$tip({
            content: err,
            type: "error",
            duration: 1000,
          })
        })
      }
    }
  }
</script>

<style scoped>
  .app-bar {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
  }

  .wrap {
    margin-top: 64px;
    background-color: white;
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
  }


  .item-text {
    min-width: 6em;
    display: inline-block;
    vertical-align: middle;
    font-weight: 500;
  }

  .avatar {
    width: 60px;
    border-radius: 50%;
  }

  .item-content {
    display: flex;
    align-items: center;
    justify-content: right;
  }

  .space {
    width: 25px;
    height: 25px;
  }

  .pop {
    width: 80vw;
    padding: 10px;
    border-radius: 10px;
  }

  .pop-title {
    font-weight: bold;
    text-align: center;
  }

  .pop-body {
    padding: 10px;
  }

  .pop-submit {
    padding: 0 10px 10px;
  }
</style>