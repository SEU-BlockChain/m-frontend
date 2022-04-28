<template>
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

    <div class="item">
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

    <div class="item">
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

    <div class="item">
      <div class="item-text">手机号码</div>
      <div class="item-content">
        <div>{{user.phone||"未绑定"}}</div>
        <var-icon size="25" name="chevron-right"/>
      </div>
    </div>
    <var-divider margin="0" inset="10"/>

    <div class="item">
      <div class="item-text">个性签名</div>
      <div class="item-content">
        <div>{{user.description||"还没有个性签名"}}</div>
        <var-icon size="25" name="chevron-right"/>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "EditInfo",
    data() {
      return {
        user: this.$store.state.user
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

</style>