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
                <level-chip :round="false" :experience="article.author.experience"/>

              </div>
            </div>
            <div class="time" v-if="use_create_time">{{this.$calc.filters.date(article.create_time)}}</div>
            <div class="time" v-else>{{this.$calc.filters.date(article.comment_time)}}</div>
          </div>
          <div v-else>
            <div class="time2">{{this.$calc.filters.date(article.update_time)}}</div>
          </div>
          <div class="title break" @click="to_article">{{article.title}}</div>
          <div class="content w-container limited-xy" v-html="this.$xss(article.description)" @click="to_article"/>
          <div class="foot">
            <div class="category">
              <var-chip v-if="!hide_category" size="small" :round="false"
                        @click="this.$router.push(`/bbs/category/${article.category.id}`)"
              >
                {{article.category.category}}
              </var-chip>
            </div>
            <var-space justify="end" size="mini" align="center" @click="to_article">
              <div class="interact">
                <icon-eye class="icon"/>
                <div class="number">{{article.view_num}}</div>
                <icon-message class="icon"/>
                <div class="number">{{article.comment_num}}</div>
                <icon-thumb-up class="icon" :class="{active:article.is_up===true}"/>
                <div class="number" :class="{active:article.is_up===true}">{{article.up_num}}</div>
              </div>
            </var-space>
          </div>
        </div>
      </template>
    </var-card>
  </div>
</template>

<script>
  import LevelChip from "../chip/LevelChip";

  export default {
    name: "ArticleCard",
    components: {LevelChip},
    props: {
      article: null,
      hide_author: false,
      use_create_time: false,
      hide_category: false
    },
    emits: [
      "onClickUser",
      "onClickImg",
    ],
    methods: {
      to_article(ev) {
        if (ev.target.getAttribute("uid")) {
          this.$emit("onClickUser", `/user/${ev.target.getAttribute("uid")}`)
          return;
        }
        if (ev.target.tagName === "IMG" && !ev.target.getAttribute("src").endsWith("svg")) {
          this.$emit("onClickImg", [ev.target.getAttribute("src")])
          return;
        }
        this.$router.push(`/bbs/article/${this.article.id}`)
      }
    }
  }
</script>

<style scoped>
  .interact {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .number {
    margin: 0 12px 0 3px;
    color: #888;
  }

  .icon {
    font-size: 20px;
    color: #888;
  }

  .wrap {
    margin-bottom: 5px;
  }

  .article-container {
    padding: 3px 5px;
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
    font-size: 14px;
    color: #999;
  }

  .title {
    margin: 3px 0;
    font-size: 16px;
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


  .interact-icon {
    overflow: hidden;
    position: relative;
  }

  .interact-text {
    float: right;
    color: #999;
  }

  .active {
    color: #4ebaee;
  }
</style>
