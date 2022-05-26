<template>
  <div class="animation-wrap">
    <var-pull-refresh v-model="refreshing" @refresh="refresh" success-duration="1000">

      <div class="head var-elevation--1">
        <div class="option" @click="this.$router.push('/reply')">
          <var-badge type="danger" :hidden="!message?.reply" :value="message?.reply" :max-value="99">
            <img class="option-icon" src="~assets/img/reply.svg" alt="">
          </var-badge>
          <div class="option-text">回复我的</div>
        </div>
        <div class="option" @click="this.$router.push('/at')">
          <var-badge type="danger" :hidden="!message?.at" :value="message?.at" :max-value="99">
            <img class="option-icon" src="~assets/img/at.svg" alt="">
          </var-badge>
          <div class="option-text">@我</div>
        </div>
        <div class="option" @click="this.$router.push('/like')">
          <var-badge type="danger" :hidden="!message?.like" :value="message?.like" :max-value="99">
            <img class="option-icon" src="~assets/img/like.svg" alt="">
          </var-badge>
          <div class="option-text">收到的赞</div>
        </div>
        <div class="option" @click="this.$router.push('/system')">
          <var-badge type="danger" :hidden="!message?.system" :value="message?.system" :max-value="99">
            <img class="option-icon" src="~assets/img/system.svg" alt="">
          </var-badge>
          <div class="option-text">系统通知</div>
        </div>
      </div>

      <div class="private">
        <div class="private-head">
          <div class="private-text">聊天列表(开发中)</div>
        </div>
        <var-divider margin="0"/>
        <var-list
          :finished="finished"
          v-model:loading="loading"
          @load="load"
          :immediate-check="false"
        >
          <div v-for="p in private_list">
            <div class="container" v-ripple="{ color: '#ccc' }" @click="this.$router.push(`/chat/${p.sender.id}`)">
              <img class="avatar"
                   :src="this.$settings.cos_url+p.sender.icon"
                   @click.stop="this.$router.push(`/user/${p.sender.id}`)"
              />
              <div class="content" @click="">
                <div class="head">
                  <div class="username" @click.stop="this.$router.push(`/user/${p.sender.id}`)">
                    {{p.sender.username}}
                  </div>
                  <div class="time">{{this.$calc.filters.date(p.time)}}</div>
                </div>
                <div class="body">
                  <div class="message">
<!--                    <span v-if="p.new" class="new">[新消息]</span>-->
                    {{this.$calc.filters.max_width(p.content,20)}}
                  </div>
<!--                  <div v-if="p.new" class="tip">{{p.new}}</div>-->
                </div>
              </div>
            </div>
          </div>
        </var-list>
      </div>
    </var-pull-refresh>
  </div>
</template>

<script>
  export default {
    name: "Message",
    emits: ["active"],
    data() {
      return {
        message: null,
        refreshing: false,
        private_list: [],
        finished: false,
        loading: true,
        next: null,
      }
    },
    methods: {
      refresh() {
        this.$request.api.get(
          "user/self/message/"
        ).then(res => {
          this.message = res.data.result
          this.$store.commit("message", res.data.result)
          this.refreshing = false
        })
        this.private_list = []
        this.finished = false
        this.loading = true
        this.next = null
        this.load()
      },
      load() {
        this.$request.api.get(
          this.next || `/message/private`
        ).then(res => {
          if (res.data.code === 147) {
            for (let i of res.data.result.results) {
              this.private_list.push(i)
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
      }
    },
    created() {
      this.$emit("active", 3)
      if (this.$store.state.message) {
        this.message = this.$store.state.message
      } else if (this.$store.state.login) {
        this.$store.state.login.then(message => {
          this.message = message
        })
      } else {
        this.$request.api.get(
          "user/self/message/"
        ).then(res => {
          this.message = res.data.result
          this.$store.commit("message", res.data.result)
        })
      }

      this.load()
    },
    activated() {
      this.$emit("active", 3)
    },
  }
</script>

<style scoped>
  .head {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
  }

  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .option {
    display: flex;
    flex-direction: column;
    width: 25%;
    padding: 4% 5%;
    align-items: center;
  }

  .option-icon {
    width: 32px;
    height: 32px;
    padding: 5%;
  }

  .option-text {
    text-align: center;
    font-size: 12px;
    color: #666666;
  }

  .private {
    margin-top: 10px;
    background-color: white;
    min-height: 100vh;
  }

  .private-head {
    display: flex;
    justify-content: space-between;
    padding: 5px;
    align-items: center;
  }

  .private-text {
    font-size: 12px;
  }

  .container {
    padding: 7px;
    border-bottom: 1px solid #eee;

    display: flex;
    justify-content: space-between;
  }

  .avatar {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    border-radius: 50%;
  }

  .head {
    display: flex;
    justify-content: space-between;
  }

  .content {
    flex-grow: 1;
    line-height: 20px;
  }

  .username {
    color: black;
    font-size: 15px;
  }

  .time {
    font-size: 12px;
    color: #999999;
  }

  .message {
    font-size: 14px;
    line-height: 14px;
    color: #777;
  }

  .body {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .tip {
    width: 16px;
    height: 16px;
    font-size: 14px;
    background-color: red;
    color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .new {
    color: #ffd700;
  }
</style>