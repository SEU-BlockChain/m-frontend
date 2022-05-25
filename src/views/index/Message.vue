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
          <div class="private-text">聊天列表</div>
        </div>
        <var-divider margin="0"/>
        开发中

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
</style>