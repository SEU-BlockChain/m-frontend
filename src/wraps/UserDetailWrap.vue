<template>
  <img class="banner" :src="this.$settings.cos_url+ 'static/user-back.webp'"/>
  <div class="bar clear-fix">
    <var-icon class="left" color="white" size="40px" name="chevron-left" @click="this.$router.return('/profile')"/>
    <div class="bar-text left">返回</div>
    <var-button class="right edit" text-color="#fc8bab" text outline type="primary"
                @click="this.$router.push('/edit-info')">编辑信息
    </var-button>
  </div>

  <div class="head var-elevation--3">
    <div class="right">
      <div class="interact-item">
        <div class="interact-item-num">0</div>
        <div class="interact-item-text">粉丝</div>
      </div>
      <div class="divider"/>
      <div class="interact-item">
        <div class="interact-item-num">0</div>
        <div class="interact-item-text">关注</div>
      </div>
      <div class="divider"/>
      <div class="interact-item">
        <div class="interact-item-num">0</div>
        <div class="interact-item-text">获赞</div>
      </div>
    </div>
    <div class="offset">
      <img class="avatar" :src="this.$settings.cos_url+user.icon">
      <div class="name">{{user.username}}</div>
      <Level :experience="user.experience"/>
    </div>
  </div>

  <div class="body">
    <var-sticky>
      <var-tabs v-model:active="active">
        <var-tab @click="this.$router.replace('/user/articles')">发布</var-tab>
        <var-tab @click="this.$router.replace('/user/comments')">评论</var-tab>
        <var-tab @click="this.$router.replace('/user/collections')">合集</var-tab>
        <var-tab @click="this.$router.replace('/user/stars')">收藏</var-tab>
      </var-tabs>
      <var-divider margin="0"/>
      <router-view @active="change_active"/>
    </var-sticky>
  </div>
</template>

<script>
  import Level from "../components/chip/Level";

  export default {
    name: "UserDetailWrap",
    components: {Level},
    data() {
      return {
        user: this.$store.state.user,
        active: 0
      }
    },
    methods: {
      change_active(index) {
        this.active = index
      }
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

  .edit {
    margin: 2px 10px;
    font-weight: bold;
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


  .avatar {
    width: 80px;
    border-radius: 50%;
    position: relative;
    top: -10px;
  }

  .name {
    font-size: 24px;
    color: #4ebaee;
    margin-bottom: 5px;
  }

  .interact-item {
    text-align: center;
    width: 50px;
    display: inline-block;
  }

  .divider {
    display: inline-block;
    width: 1px;
    height: 25px;
    margin: 10px 2px 5px;
    background-color: #aaa;
  }

  .interact-item-text {
    line-height: 20px;
    font-size: 14px;
    color: #666;
  }

  .body {
    margin-top: 10px;
    background-color: white;
    border-radius: 5px 5px 0 0;
    min-height: 100vh;
  }
</style>