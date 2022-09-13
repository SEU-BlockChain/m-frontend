<template>
  <div class="container" :class="{'new':comment.new}">
    <img v-if="!hide_head"
         class="avatar"
         :src="this.$settings.cos_url+comment.author.icon"
         @click="this.$router.push(`/user/${comment.author.id}`)"
    />

    <div class="content">
      <div v-if="!hide_head" class="head">
        <div class="name-level" @click="this.$router.push(`/user/${comment.author.id}`)">
          <div class="name">{{comment.author.username}}</div>
          <div>
            <level-chip :experience="comment.author.experience"/>
          </div>

          <div v-if="article&&comment.author.id===article.author.id">
            <var-chip size="mini" type="warning" :round="false"> 楼主</var-chip>
          </div>
        </div>

        <var-icon :size="16" name="dots-vertical" @click="on_click_option"/>
      </div>

      <div class="body">
        <div
          class="w-container"
          v-html="this.$xss(comment.content)"
          @click="on_click_content"
        />

        <slot name="children-comment"/>

        <div class="foot">
          <div class="time">
            {{this.$calc.filters.date(comment.comment_time)}}
          </div>
          <div v-if="comment.target_id&&!hide_conversation"
               class="conversation"
               @click="on_click_conversation_detail">
            对话详情
          </div>
          <div class="interact">

            <div v-if="show_comment_num" class="flex-center stay" @click="on_click_conversation">
              <img class="interact-icon" src="~assets/img/comment.svg" height="16" alt="">
              <div class="interact-text">{{comment.comment_num}}
              </div>
            </div>


            <div class="flex-center stay" @click="on_vote(1)">
              <img
                v-if="comment.is_up===true"
                class="interact-icon"
                src="~assets/img/up-active.svg"
                height="16"
                alt="">
              <img
                v-else
                class="interact-icon"
                src="~assets/img/up.svg"
                height="16"
                alt="">
              <div class="interact-text" :class="{active:comment.is_up===true}">{{comment.up_num}}</div>
            </div>

            <div class="flex-center stay" @click="on_vote(0)">
              <img
                class="interact-icon"
                v-if="comment.is_up===false"
                src="~assets/img/down-active.svg"
                height="16"
                alt="">
              <img
                class="interact-icon"
                v-else
                src="~assets/img/down.svg"
                height="16"
                alt="">
              <div class="interact-text" :class="{active:comment.is_up===false}">{{comment.down_num}}</div>
            </div>

            <div v-if="!show_comment_num" class="flex-cente" @click="on_click_conversation">
              <img class="interact-icon" src="~assets/img/comment.svg" height="16" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import LevelChip from "../chip/LevelChip";

  export default {
    name: "CommonCommentCard",
    components: {LevelChip},
    props: {
      article: null,
      parent: null,
      comment: null,
      hide_conversation: false,
      show_comment_num: null,
      hide_head: false
    },
    emits: [
      "onClickOption",
      "onClickContent",
      "onVote",
      "onClickConversationDetail",
      "onClickUser",
      "onClickImg",
    ],
    computed: {
      is_self() {
        return this.comment.author.id === this.$store.state.user.id
      }
    },
    methods: {
      on_click_option() {
        this.$emit('onClickOption', this.comment)
      },
      on_click_conversation() {
        this.$emit('onClickContent', this.parent || this.comment, this.parent && this.comment)
      },
      on_click_content(ev) {
        if (ev.target.getAttribute("uid")) {
          this.$emit("onClickUser", ev.target.getAttribute("uid"))
          return;
        }
        if (ev.target.tagName === "IMG") {
          this.$emit("onClickImg", [ev.target.getAttribute("src")])
          return;
        }
        this.$emit('onClickContent', this.parent || this.comment, this.parent && this.comment)
      },
      on_vote(is_up) {
        this.$emit('onVote', is_up, this.comment)
      },
      on_click_conversation_detail() {
        this.$emit('onClickConversationDetail', this.comment)
      }
    }
  }
</script>

<style scoped>
  .container {
    width: 100%;
    padding: 10px;
    display: flex;
    justify-content: space-between;
  }

  .avatar {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    border-radius: 50%;
  }

  .content {
    flex-grow: 1;
  }

  .head {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .name-level {
    display: flex;
    justify-content: left;
    align-items: baseline;
    line-height: 30px;
  }

  .name {
    font-size: 15px;
    color: #333333;
    margin-right: 3px;
  }

  .foot {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }

  .interact {
    display: flex;
    justify-content: right;
    overflow: hidden;
  }

  .time {
    line-height: 20px;
    font-size: 12px;
    color: #666666;
  }

  .interact-icon {
    margin: 2px 0;
    position: relative;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
  }

  .interact-text {
    line-height: 20px;
    float: right;
    color: #999;
  }

  .conversation {
    line-height: 20px;
    font-size: 12px;
    color: #666666;
  }

  .stay {
    min-width: 50px;
  }

  .active {
    color: #4ebaee;
  }
</style>
