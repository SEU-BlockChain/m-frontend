<template>
  <div class="animation-wrap">
    <img class="profile-back" :src="this.$settings.cos_url+ 'static/profile-back.webp'"/>
    <div class="user-info">
      <img class="avatar var-elevation--1" @click="this.$router.push('/user')" :src="icon">
      <div v-if="this.$store.state.is_login" class="ribbon var-elevation--1" @click="this.$router.push('/user')">个人主页
        <var-icon name="menu-right"/>
      </div>

      <div class="info-wrap">
        <div v-if="this.$store.state.is_login">
          <div class="name">
            <var-space size="mini">
              {{this.$store.state.user.username}}
              <var-chip size="mini" class="id">UID:{{this.$store.state.user.id}}</var-chip>
              <level-chip :experience="this.$store.state.user.experience" @click="this.$router.push('/user/level')"/>
            </var-space>
          </div>
          <var-divider style="--divider-color:#f0f1f5"/>
          <div class="interact" @click="this.$router.push({path:'/user/follow',query:{type:'as_followed'}})">
            <span class="interact-num">{{this.$store.state.user.fans_num}}</span>
            <span class="interact-text">粉丝</span>
          </div>
          <div class="interact" @click="this.$router.push({path:'/user/follow',query:{type:'as_follower'}})">
            <span class="interact-num">{{this.$store.state.user.attention_num}}</span>
            <span class="interact-text">关注</span>
          </div>
          <div class="interact">
            <span class="interact-num">{{this.$store.state.user.up_num}}</span>
            <span class="interact-text">获赞</span>
          </div>
        </div>
        <div v-else @click="this.$router.push('/login')">
          <div class="name">未登录用户</div>
          <div class="tip">登录后，内容更精彩!</div>
        </div>
      </div>
    </div>

    <div class="token clear-fix" v-if="wallet.init">
      <div class="clear-fix">
        <div class="account">我的钱包
          <span class="address">{{this.$calc.filters.simple_address(wallet.address)}}</span>
        </div>
        <div class="balance">余额：{{wallet.PMB}}</div>
      </div>
      <var-row>
        <var-col :span="11">
          <div class="token-item clear-fix">
            <img class="token-img" src="~assets/img/get-token.png" alt="">
            <div class="token-text">获取PMB</div>
          </div>
        </var-col>
        <var-col :span="11" :offset="2">
          <div class="token-item clear-fix">
            <img class="token-img" src="~assets/img/my-account.png" alt="">
            <div class="token-text">账户详情</div>
          </div>
        </var-col>
      </var-row>
    </div>

    <div class="my">
      <div v-ripple="{ color: '#ccc' }" class="my-item clear-fix">
        <var-icon class="my-icon left" name="format-list-checkbox"/>
        <div class="my-text">浏览历史</div>
        <var-icon class="my-icon right" name="chevron-right"/>
      </div>
      <var-divider style="--divider-color:#f0f1f5"/>
      <div v-ripple="{ color: '#ccc' }" class="my-item clear-fix">
        <var-icon class="my-icon left" name="pin-outline"/>
        <div class="my-text">创作中心</div>
        <var-icon class="my-icon right" name="chevron-right"/>
      </div>
      <var-divider style="--divider-color:#f0f1f5"/>
      <div v-ripple="{ color: '#ccc' }" class="my-item clear-fix">
        <var-icon class="my-icon left" name="checkbox-marked-circle-outline"/>
        <div class="my-text">问卷调研</div>
        <var-icon class="my-icon right" name="chevron-right"/>
      </div>
    </div>

    <div class="system">
      <div v-ripple="{ color: '#ccc' }" class="my-item clear-fix">
        <var-icon class="my-icon left" name="message-text-outline"/>
        <div class="my-text">反馈</div>
        <var-icon class="my-icon right" name="chevron-right"/>
      </div>
      <var-divider style="--divider-color:#f0f1f5"/>
      <div v-ripple="{ color: '#ccc' }" class="my-item clear-fix" @click="this.$router.push('/setting')">
        <var-icon class="my-icon left" name="cog-outline"/>
        <div class="my-text">设置</div>
        <var-icon class="my-icon right" name="chevron-right"/>
      </div>
    </div>
    <div style="height: 200px"/>
  </div>
</template>

<script>
  import Level from "../../components/chip/Level";
  import LevelChip from "../../components/chip/LevelChip";
  export default {
    name: "Profile",
    components: {LevelChip, Level},
    emits: ["active"],
    data() {
      return {
        wallet: this.$store.state.wallet,
      }
    },
    computed: {
      icon() {
        return this.$settings.cos_url + (this.$store.state.user?.icon || "icon/login.jpg")
      },

    },
    created() {
      this.$emit("active", 4)
    },
    activated() {
      this.$emit("active", 4)
    }
  }
</script>

<style scoped>
  .profile-back {
    width: 100vw;
    height: 35vw;
    opacity: .8;
    vertical-align: bottom;
  }

  .user-info {
    width: 100%;
    background-color: white;
    border-radius: 0 0 10px 10px;
  }

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    position: relative;
    left: 20px;
    top: -25px;
  }

  .ribbon {
    margin-top: 20px;
    border-radius: 3px 0 0 3px;
    line-height: 20px;
    font-size: 12px;
    float: right;
    background-color: #f6f6f6;
    padding: 5px 10px;
  }

  .info-wrap {
    padding: 10px 20px;
    position: relative;
    top: -25px;
  }

  .name {
    font-size: 24px;
    font-weight: bold;
  }

  .id {
    font-size: 12px;
    color: #aaaaaa;
    padding: 3px;
  }

  .tip {
    font-size: 14px;
    margin-top: 10px;
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

  .token, .my, .system {
    margin-top: 10px;
    background-color: white;
    padding: 15px 20px;
  }

  .account {
    border-radius: 10px;
    padding-bottom: 10px;
    font-weight: bold;
    float: left;
  }

  .balance {
    border-radius: 10px;
    padding-bottom: 10px;
    float: right;
    color: #4ebaee;
    font-size: 15px;
  }

  .token-item {
    background-color: #f6f6f6;
    border-radius: 5px;
    width: 100%;
  }

  .token-img {
    float: left;
    margin-left: 10px;
    height: 40px;
    vertical-align: bottom;
  }

  .token-text {
    float: left;
    line-height: 40px;
    font-size: 13px;
  }

  .my-item {
    line-height: 30px;
    font-size: 15px;
  }

  .my-icon {
    margin: 5px;
    color: #777;
  }

  .my-text {
    float: left;
  }

  .address {
    font-size: 12px;
    color: #999999;
    font-weight: normal;
  }
</style>