<template>
  <div class="wrap">
    <var-card class="card" elevation="0">
      <template #extra>
        <div class="comment-container" @click="this.$router.push(to)">
          <var-space justify="space-between" align="center">
            <var-space justify="start" align="center" size="mini" v-if="!simple"
                       @click="this.$router.push(`/user/${comment.author.id}`)">
              <img class="avatar" :src="this.$settings.cos_url+comment.author.icon">
              <div class="username">{{comment.author.username}}</div>
              <level-chip :round="false" :experience="comment.author.experience"/>
            </var-space>
            <div class="time">{{this.$calc.filters.date(comment.comment_time)}}</div>
          </var-space>
          <div class="w-container" v-html="this.$xss(comment.content)" @click.stop="on_click_content"/>

          <div class="to" v-if="comment.target||comment.parent">
            <span class="name">{{(comment.target||comment.parent).author.username}}:</span>
            <span class="break" v-html="(comment.target||comment.parent).description"/>
          </div>
          <var-space justify="end" align="center" size="mini">
            <img v-if="comment.is_up===true"
                 class="interact-icon"
                 src="~assets/img/up-active.svg"
                 height="16"
                 alt="">
            <img v-else
                 class="interact-icon"
                 src="~assets/img/up.svg"
                 height="16"
                 alt="">
            <div class="interact-text" :class="{active:comment.is_up===true}">{{comment.up_num}}</div>

            <img v-if="comment.is_up===false"
                 class="interact-icon"
                 src="~assets/img/down-active.svg"
                 height="16"
                 alt="">
            <img v-else
                 class="interact-icon"
                 src="~assets/img/down.svg"
                 height="16"
                 alt="">
            <div class="interact-text" :class="{active:comment.is_up===false}">{{comment.down_num}}</div>

            <img
              class="interact-icon"
              src="~assets/img/comment.svg"
              height="16"
              alt="">
            <div class="interact-text">{{comment.comment_num}}</div>
          </var-space>


          <div v-if="comment.article" class="post">
            <var-space size="small">
              <var-chip size="mini" :round="false" type="success">文章</var-chip>
              {{comment.article.title}}
            </var-space>
          </div>
          <div v-if="comment.column" class="post">
            <var-space size="small">
              <var-chip size="mini" :round="false" type="info">专栏</var-chip>
              {{comment.column.title}}
            </var-space>
          </div>
          <div v-if="comment.issue" class="post">
            <var-space size="small">
              <var-chip size="mini" :round="false" type="warning">话题</var-chip>
              <div class="address">{{this.$calc.filters.simple_address(comment.issue.address)}}</div>
            </var-space>
          </div>
        </div>
      </template>
    </var-card>
  </div>
</template>

<script>
  export default {
    name: "CommentCard",
    props: {
      comment: null,
      simple: false
    },
    emits: [
      "onClickUser",
      "onClickImg",
    ],
    computed: {
      to() {
        if (this.comment.article) return `/bbs/article/${this.comment.article.id}`
        if (this.comment.column) return `/special/column/${this.comment.column.id}`
        if (this.comment.issue) return `/issue/${this.comment.issue.address}`
      }
    },
    methods: {
      on_click_content(ev) {
        if (ev.target.getAttribute("uid")) {
          this.$emit("onClickUser", ev.target.getAttribute("uid"))
          return;
        }
        if (ev.target.tagName === "IMG") {
          this.$emit("onClickImg", [ev.target.getAttribute("src")])
          return;
        }

        this.$router.push(this.to)
      },
    }
  }
</script>

<style scoped>
  .to {
    font-size: 13px;
    color: #999;
    margin: 0 10px;
    padding-left: 5px;
    border-left: 2px solid #ccc;
  }

  .post {
    margin: 10px;
    padding: 8px 10px;
    border-radius: 5px;
    background-color: #f0f1f5;
  }

  .interact-text {
    float: right;
    color: #999;
    margin-right: 10px;
  }

  .interact-icon {
    position: relative;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
  }

  .w-container {
    padding: 0 10px;
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

  .time {
    line-height: 40px;
    font-size: 14px;
    color: #666666;
  }

  .wrap {
    margin-bottom: 5px;
  }

  .comment-container {
    padding: 3px 5px;
  }

  .name {
    margin-right: 10px;
    color: black;
  }

  .address {
    font-size: 12px;
    color: #888888;
  }

  .active {
    color: #4ebaee;
  }
</style>
