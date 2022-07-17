<template>
  <div class="container">
    <div class="author-info">
      <img class="avatar" :src="this.$settings.cos_url+author.icon" @click="this.$router.push(`/user/${author.id}`)"/>
      <div @click="this.$router.push(`/user/${author.id}`)">
        <var-space size="2">
          <div class="name">{{author.username}}</div>
          <level-chip :round="false" :experience="author.experience"/>
        </var-space>
        <div class="desc">{{this.$calc.filters.max_width(author.description,20)||"还没有签名"}}</div>
      </div>
    </div>
    <div class="button">
      <var-button v-if="author.followed" text outline class="right btn shadow" size="small" @click="not_follow">
        <template #default>
          <var-icon size="14" name="minus"/>
          {{author.follower?"已互关" :"取消关注"}}
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
</template>

<script>
  import LevelChip from "../chip/LevelChip";

  export default {
    name: "SimpleAuthorCard",
    components: {LevelChip},
    props: {
      author: null
    },
    methods: {
      follow() {
        this.$tools.follow(this.$request, this.author, this.$tip)
      },
      not_follow() {
        this.$tools.not_follow(this.$request, this.author, this.$tip, this.$dialog)
      }
    }
  }
</script>

<style scoped>
  .container {
    display: flex;
    justify-content: space-between;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .author-info {
    display: flex;
    justify-content: left;
  }

  .name-level {
    line-height: 25px;
    display: flex;
    justify-content: left;
  }

  .name {
    font-weight: 600;
  }

  .level {
    line-height: 25px;
  }

  .desc {
    line-height: 15px;
    font-size: 12px;
    color: #777777;
  }

  .button {
    margin: 6px 0;
  }
</style>