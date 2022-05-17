<template>
  <img class="banner" :src="this.$settings.cos_url+ 'static/user-back.webp'"/>

  <div class="bar clear-fix">
    <var-icon class="left" color="white" size="40px" name="chevron-left" @click="this.$router.return('/profile')"/>
    <div class="bar-text left">返回</div>
    <div class="manage right">
      <var-icon size="26" name="dots-vertical" @click="show=true"/>
    </div>
  </div>

  <div v-if="user" class="head var-elevation--3">
    <var-button class="right btn" size="small" type="primary" outline text>
      <template #default>
        <var-icon name="message-processing-outline" size="14"/>
        私信
      </template>
    </var-button>

    <var-button v-if="!user.followed" class="right btn" size="small" type="primary" @click="follow">
      <template #default>
        <div style="padding: 0 20px">
          <var-icon name="plus" size="14"/>
          关注
        </div>
      </template>
    </var-button>

    <var-button v-else class="right btn" size="small" @click="not_follow">
      <template #default>
        <div style="padding: 0 20px">
          <var-icon name="minus" size="14"/>
          {{user.follower?"已互关" :"取消关注"}}
        </div>
      </template>
    </var-button>

    <div class="offset">
      <img class="avatar" :src="this.$settings.cos_url+user.icon">
      <div>
        <span class="name">{{user.username}}</span>
        <var-chip size="mini">LV{{this.$calc.calc_rank(user.experience).level}}</var-chip>
      </div>
    </div>
    <div class="offset2">
      <var-divider/>
      <div class="interact">
        <span class="interact-num">{{user.fans_num}}</span>
        <span class="interact-text">粉丝</span>
      </div>
      <div class="interact">
        <span class="interact-num">{{user.attention_num}}</span>
        <span class="interact-text">关注</span>
      </div>
      <div class="interact">
        <span class="interact-num">{{user.up_num}}</span>
        <span class="interact-text">获赞</span>
      </div>
    </div>
  </div>
  {{user}}

  <var-popup position="bottom" v-model:show="show">
    <div class="popup">
      <div class="pop-item" @click="black">
        <img class="pop-img" src="~assets/img/black.svg" alt="">
        <div class="pop-text">拉黑</div>
      </div>
    </div>
  </var-popup>

</template>

<script>
  export default {
    name: "UserInfo",
    data() {
      return {
        user: null,
        show: false
      }
    },
    methods: {
      follow() {
        this.$tools.follow(this.$request, this.user, this.$tip)
      },
      not_follow() {
        this.$tools.not_follow(this.$request, this.user, this.$tip, this.$dialog)
      },
      black() {
        this.$tools.black(this.$request, this.user, this.$tip)
      }
    },
    created() {
      this.$request.api.get(
        `user/${this.$route.params.id}/info/`
      ).then(res => {
        this.user = res.data.result.user
      })
    }
  }
</script>

<style scoped>
  .banner {
    width: 100vw;
    opacity: .8;
    vertical-align: bottom;
    height: 40vw;
  }

  .bar {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    padding: 20px 10px;
  }

  .bar-text {
    line-height: 40px;
    font-size: 16px;
    font-weight: bold;
    color: white;
  }

  .manage {
    margin: 7px 10px;
    color: white;
    font-weight: lighter;
  }

  .head {
    background-color: white;
    padding: 0 20px;
    border-radius: 0 0 5px 5px;
  }

  .offset {
    position: relative;
    top: -30px;
  }

  .offset2 {
    position: relative;
    top: -20px;
  }

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    position: relative;
    top: -10px;
  }

  .name {
    font-size: 24px;
    color: #4ebaee;
    margin-bottom: 5px;
  }

  .interact {
    display: inline-block;
    line-height: 20px;
    margin-right: 20px;
    margin-top: 10px;
  }

  .interact-num {
    padding: 1px;
    font-size: 18px;
  }

  .interact-text {
    font-size: 14px;
    color: #777777;
  }

  .btn {
    margin: 10px 5px;
    z-index: 10;
  }

  .popup {
    padding: 20px 0 10px;
  }


  .pop-item {
    width: 20vw;
  }

  .pop-img {
    width: 40%;
    margin: 0 30%;
  }

  .pop-text {
    text-align: center;
  }
</style>