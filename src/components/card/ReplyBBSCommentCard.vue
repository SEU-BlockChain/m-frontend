<template>
  <div class="wrap" >
    <img class="avatar"
         :src="this.$settings.cos_url+comment.content.author.icon"
         @click="this.$router.push(`/user/${comment.content.author.id}`)"
    />
    <div class="body">
      <div class="author" @click="this.$router.push(`/user/${comment.content.author.id}`)">
        <div class="username">{{comment.content.author.username}}</div>
        <div class="tip">回复了你的{{text[type]}}</div>
      </div>

      <div @click="on_click_content" class="content w-container"
           v-html="this.$xss(comment.content.description)"/>
      <div @click="on_click_content" v-if="type" class="extra">
        <div v-if="type===1" class="w-container" v-html="this.$xss(comment.content.parent.description)"/>
        <div v-else class="w-container" v-html="this.$xss(comment.content.target.description)"/>
      </div>

      <div class="other">
        <div class="left">
          <div class="time">
            {{this.$calc.filters.date(comment.content.comment_time)}}
          </div>

          <icon-thumb-up size="20" :strokeWidth="3" @click="on_vote(1)"
                         :style="{color:comment.content.is_up?'4ebaee':'#888'}"/>

          <icon-message size="20" :strokeWidth="3" @click="on_click_comment" style="color: #888;margin-left: 12px"/>
        </div>
        <icon-delete @click="on_delete"/>
      </div>
      <div v-if="!type" class="article" @click="this.$router.push(`/bbs/article/${comment.content.article.id}`)">
        {{this.$calc.filters.max_width(comment.content.article.title,20)}}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ReplyCommentCard",
    props: {
      comment: null,
    },
    emits: [
      "onVote",
      "onClickComment",
      "onClickUser",
      "onClickImg",
    ],
    data() {
      return {
        text: [
          "文章",
          "评论",
          "评论",
        ]
      }
    },
    computed: {
      type() {
        if (!this.comment.content.parent) {
          return 0
        } else if (!this.comment.content.target) {
          return 1
        }
        return 2
      }
    },
    methods: {
      on_vote(is_up) {
        this.$emit(
          'onVote',
          is_up,
          0,
          this.comment.content.article,
          this.comment.content
        )
      },
      on_click_content(ev) {
        if (ev.target.getAttribute("uid")) {
          this.$router.push(`/user/${ev.target.getAttribute("uid")}`)
          return;
        }
        if (ev.target.tagName === "IMG" && !ev.target.getAttribute("src").endsWith("svg")) {
          this.$emit("onClickImg", [ev.target.getAttribute("src")])
          return;
        }
        this.$router.push(`/bbs/article/${this.comment.content.article.id}`)
      },
      on_click_comment() {
        this.$emit(
          'onClickComment',
          0,
          this.comment.content.article,
          this.comment.content.parent || this.comment.content,
          this.comment.content.parent && this.comment.content
        )
      },
      on_delete() {
        this.$emit(
          'onDelete',
          this.comment,
        )
      }
    }
  }
</script>

<style scoped>
  .wrap {
    background-color: white;
    padding: 15px;
    display: flex;
    justify-content: left;
    width: 100vw;
  }

  .avatar {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    border-radius: 50%;
  }

  .body {
    width: 80vw;
  }

  .article {
    font-size: 12px;
    margin: 10px 0;
    color: black;
    padding: 10px;
    border-radius: 5px;
    align-self: flex-start;
    background-color: #f6f6f6;
  }

  .author {
    display: flex;
    justify-content: left;
  }

  .username {
    font-size: 14px;
    color: black;
    font-weight: 600;
    margin-right: 5px;
  }

  .tip {
    font-size: 14px;
    color: #777;
  }

  .content {
    font-size: 15px;
    margin: 5px 0;
  }

  .extra {
    font-size: 13px;
    color: #999;
    margin: 10px 0;
    padding-left: 5px;
    border-left: 2px solid #ccc;
  }

  .other {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 20px;
  }

  .left {
    display: flex;
    justify-content: left;
    align-items: center;
  }

  .time {
    font-size: 12px;
    margin-right: 12px;
    color: #999;
  }

</style>