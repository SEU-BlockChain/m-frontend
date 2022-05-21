<template>
  <div class="animation-wrap">
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
        <div class="interact-item" @click="this.$router.push({path:'/user/follow',query:{type:'as_followed'}})">
          <div class="interact-item-num">{{user.fans_num}}</div>
          <div class="interact-item-text">粉丝</div>
        </div>
        <div class="divider"/>
        <div class="interact-item" @click="this.$router.push({path:'/user/follow',query:{type:'as_follower'}})">
          <div class="interact-item-num">{{user.attention_num}}</div>
          <div class="interact-item-text">关注</div>
        </div>
        <div class="divider"/>
        <div class="interact-item">
          <div class="interact-item-num">{{user.up_num}}</div>
          <div class="interact-item-text">获赞</div>
        </div>
      </div>
      <img class="avatar offset" :src="this.$settings.cos_url+user.icon">
      <div class="name offset">{{user.username}}</div>
      <Level class="offset" :experience="user.experience"/>
    </div>

    <var-card class="card button" elevation="1">
      <template #extra>
        <div class="button-container">
          <div class="button-item" @click="this.$router.push('/user/black-list')">
            <img class="button-img" src="~assets/img/black-list.png" alt="">
            <div class="button-text">黑名单</div>
          </div>
        </div>
      </template>
    </var-card>

    <div class="body">
      <var-tabs sticky color="white" v-model:active="active">
        <var-tab @click="this.$router.replace('/user/articles')">发布</var-tab>
        <var-tab @click="this.$router.replace('/user/comments')">评论</var-tab>
        <var-tab @click="this.$router.replace('/user/collections')">合集</var-tab>
        <var-tab @click="this.$router.replace('/user/stars')">收藏</var-tab>
      </var-tabs>
      <var-divider margin="0"/>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component @active="change_active" :is="Component"/>
        </keep-alive>
      </router-view>
    </div>
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
    height: 80px;
    border-radius: 50%;
    position: relative;
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
    z-index: 100;
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
    background-color: #fafafa;
    border-radius: 5px 5px 0 0;
    min-height: 100vh;
  }

  .button {
    margin: 10px 0;
    padding: 10px 0;
  }

  .button-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .button-item {
    padding: 10px;
    width: 20%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .button-img {
    width: 40%;
    margin: 0 30%;
  }

  .button-text {
    text-align: center;
    font-size: 12px;
    line-height: 15px;
    color: #777777;
  }

</style>