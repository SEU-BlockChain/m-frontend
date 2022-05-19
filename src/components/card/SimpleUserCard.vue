<template>
  <div class="container">
    <img class="avatar" :src="this.$settings.cos_url+user.icon" @click="this.$router.push(`/user/${user.id}`)"/>
    <div @click="this.$router.push(`/user/${user.id}`)">
      <div class="name">{{user.username}}</div>
      <div class="desc">{{this.$calc.filters.max_width(user.description,20)||"还没有签名"}}</div>
      <div class="time">关注时间:{{user.create_time.substring(0,19).replace("T"," ")}}</div>
    </div>
    <div class="button">
      <var-button v-if="user.followed" text outline class="right btn shadow" size="small" @click="not_follow">
        <template #default>
          <var-icon size="14" name="minus"/>
          {{user.follower?"已互关" :"取消关注"}}
        </template>
      </var-button>

      <var-button v-else class="right btn" text outline size="small" type="primary" @click="follow">
        <template #default>
          <var-icon size="14" name="plus"/>
          关注
        </template>
      </var-button>
    </div>
  </div>
  <var-divider margin="0"/>
</template>

<script>
  export default {
    name: "SimpleUserCard",
    props: {
      user: null
    },
    methods: {
      follow() {
        this.$tools.follow(this.$request, this.user, this.$tip)
      },
      not_follow() {
        this.$tools.not_follow(this.$request, this.user, this.$tip, this.$dialog)
      }
    }
  }
</script>

<style scoped>
  .container {
    display: flex;
    padding: 10px;
  }

  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .name {
    line-height: 25px;
    font-size: 16px;
  }

  .desc {
    width: calc(100vw - 180px);
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    color: #666666;
  }

  .time {
    line-height: 15px;
    font-size: 10px;
    color: #999;
  }

  .button {
    width: 100px;
    padding: 16px;
  }

  .btn {
    width: 80px;
  }

  .shadow {
    --button-default-color: #eee;
  }
</style>