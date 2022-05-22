<template>
  <div class="wrap">
    <var-card class="card" elevation="0">
      <template #extra>
        <div class="article-container">
          <div v-if="!hide_author" class="head">
            <div class="user-info" @click="this.$router.push(`/user/${article.author.id}`)">
              <img class="avatar" :src="this.$settings.cos_url+article.author.icon">
              <div class="username">{{article.author.username}}</div>
              <div class="level">
                <var-chip size="mini" type="info" :round="false">
                  Lv.{{this.$calc.calc_rank(article.author.experience).level}}
                </var-chip>
              </div>
            </div>
            <div class="time" v-if="use_create_time">{{this.$calc.filters.date(article.create_time)}}</div>
            <div class="time" v-else>{{this.$calc.filters.date(article.update_time)}}</div>
          </div>
          <div v-else>
            <div class="time2">{{this.$calc.filters.date(article.update_time)}}</div>
          </div>
          <div class="title break" @click="to_article">{{article.title}}</div>
          <div class="content w-container limited-xy" v-html="article.description" @click="to_article"/>
          <div class="foot">
            <div class="category">
              <var-chip size="small" :round="false" @click="change_category(article.category.id)">
                {{article.category.category}}
              </var-chip>
            </div>
            <div class="interact" @click="to_article">
              <img class="interact-icon" src="~assets/img/view.svg" height="20" alt="">
              <div class="interact-text">{{article.view_num}}</div>

              <img class="interact-icon" v-if="article.is_up===true" src="~assets/img/up-active.svg" height="20"
                   alt="">
              <img class="interact-icon" v-else src="~assets/img/up.svg" height="20"
                   alt="">
              <div class="interact-text" :class="{active:article.is_up===true}">{{article.up_num}}</div>

              <img class="interact-icon" src="~assets/img/comment.svg" height="20" alt="">
              <div class="interact-text">{{article.comment_num}}</div>
            </div>
          </div>
        </div>
      </template>
    </var-card>
  </div>
</template>

<script>
  export default {
    name: "ArticleCard",
    props: {
      article: null,
      hide_author: false,
      use_create_time: false
    },
    emits: ["change_category"],
    methods: {
      change_category(id) {
        this.$emit("change_category", id)
      },
      to_article() {
        this.$router.push(`/bbs/article/${this.article.id}`)
      }
    }
  }
</script>

<style scoped>
  .wrap {
    margin-bottom: 5px;
  }

  .article-container {
    padding: 10px;
  }

  .head {
    display: flex;
    justify-content: space-between;
    height: 40px;
  }

  .avatar {
    width: 30px;
    height: 30px;
    margin: 5px 0;
    border-radius: 50%;
  }

  .username {
    font-size: 14px;
    font-weight: 600;
    padding: 0 5px;
  }

  .user-info {
    display: flex;
    justify-content: left;
    line-height: 40px;
  }

  .time {
    line-height: 40px;
    font-size: 14px;
    color: #666666;
  }

  .time2 {
    font-size: 16px;
    color: #999;
  }

  .title {
    margin: 6px 0;
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;

  }

  .content {
    color: #666666;
    font-size: 15px;
  }

  .foot {
    line-height: 50px;
    display: flex;
    justify-content: space-between;
  }

  .interact {
    display: flex;
    justify-content: right;
  }

  .interact-icon {
    margin: 15px 0;
    overflow: hidden;
    position: relative;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
  }

  .interact-text {
    line-height: 50px;
    float: right;
    min-width: 30px;
    color: #999;
  }
</style>