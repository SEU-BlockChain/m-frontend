<template>
  <div class="animation-wrap">
    <var-app-bar class="app-bar" color="white" text-color="#333" :title="user.username">
      <template #left>
        <var-button
          round
          text
          color="transparent"
          text-color="#333"
          @click="this.$router.return('/message')"
        >
          <var-icon name="chevron-left" :size="24"/>
        </var-button>
      </template>
      <template #right>
        <var-button
          round
          text
          color="transparent"
          text-color="#333"
        >
          <var-icon name="dots-vertical" :size="20"/>
        </var-button>
      </template>
    </var-app-bar>

    <div id="container">
      <div class="wrap" v-for="chat in chat_list">
        <div v-if="chat.sender_id===user.id">
          <div class="flex-left">
            <img class="avatar" :src="this.$settings.cos_url+user.icon"/>
            <div style="margin-left: 10px">
              <div class="time-left">{{this.$calc.filters.date(chat.time)}}</div>
              <div class="chat-left">{{chat.content}}</div>
            </div>

          </div>
        </div>
        <div v-else>
          <div class="flex-right">
            <div style="margin-right: 10px">
              <div class="time-right">{{this.$calc.filters.date(chat.time)}}</div>
              <div class="chat-right">{{chat.content}}</div>
            </div>
            <img class="avatar" :src="this.$settings.cos_url+this.$store.state.user.icon"/>
          </div>
        </div>
      </div>
    </div>

    <div class="foot">
      <a-textarea v-model="text" placeholder="请输入文本" :auto-size="{minRows:1,maxRows:3}"/>

      <var-button
        class="submit"
        type="info"
        :disabled="!Boolean(text)"
        size="small"
        text-color="#333"
        @click="send_private"
      >确定
      </var-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Chat",
    data() {
      return {
        user: "",
        text: "",
        chat_list: [],
        container: null
      }
    },
    watch: {},
    methods: {
      load() {
        this.$request.api.get(
          this.next || `/message/private_detail?uid=${this.$route.params.id}`
        ).then(res => {
          if (res.data.code === 149) {
            for (let i of res.data.result.results) {
              this.chat_list.push(i)
            }
            this.next = res.data.result.next
            this.loading = false
            this.finished = !Boolean(this.next)
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
        })
      },
      send_private() {
        this.$request.api.post(
          this.next || `/message/private_detail/?uid=${this.$route.params.id}`,
          {
            content: this.text
          }
        ).then(res => {
          if (res.data.code === 151) {
            this.chat_list.push(res.data.result)
            this.text = ""
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
        })
      }
    },
    created() {
      this.$request.api.get(
        `/user/info/${this.$route.params.id}/`
      ).then(res => {
        if (res.data.code === 141) {
          this.user = res.data.result
        }
      })
      this.load()
    },
    mounted() {
      // window.onscroll = () => {
      // console.log(document.documentElement.scrollTop);
      // }
    }
  }
</script>

<style scoped>
  .app-bar {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    z-index: 20;
  }

  .foot {
    position: fixed;
    left: 0;
    bottom: 0;
    background-color: white;
    padding: 10px;
    width: 100vw;
    display: flex;
    justify-content: space-between;
  }

  .input {
    border-radius: 5px;
    background-color: #f6f6f6;
    padding: 5px;
  }

  .submit {
    margin: 0 10px;
  }

  #container {
    padding: 64px 10px;
    min-height: 100vh;
    overflow: auto;
  }

  .flex-left {
    display: flex;
    justify-content: flex-start;
  }

  .flex-right {
    display: flex;
    justify-content: flex-end;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .chat-left {
    padding: 10px;
    background-color: white;
    border-radius: 0 10px 10px 10px;
  }

  .chat-right {
    padding: 10px;
    background-color: #4ebaee;
    border-radius: 10px 0 10px 10px;
  }

  .time-left {
    text-align: left;
    font-size: 12px;
    color: #999999;
  }

  .time-right {
    text-align: left;
    font-size: 12px;
    color: #999999;
  }

  .wrap {
    margin-bottom: 20px;
  }
</style>