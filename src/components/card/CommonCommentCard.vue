<template>
  <div class="container" :class="{'new':comment.new}">
    <img
      class="avatar"
      :src="this.$settings.cos_url+comment.author.icon"
      @click="this.$router.push(`/user/${comment.author.id}`)"
    />

    <div class="content">
      <div class="head">
        <div class="name-level" @click="this.$router.push(`/user/${comment.author.id}`)">
          <div class="name">{{comment.author.username}}</div>

          <div>
            <var-chip size="mini" type="info" :round="false">
              Lv.{{this.$calc.calc_rank(comment.author.experience).level}}
            </var-chip>
          </div>

          <div v-if="comment.author.id===article.author.id">
            <var-chip size="mini" type="warning" :round="false"> 楼主</var-chip>
          </div>
        </div>

        <var-icon :size="16" name="dots-vertical" @click="on_click_option"/>
      </div>

      <div class="body">
        <div
          class="w-container"
          v-html="comment.content"
          @click="on_click_content"
        />

        <slot name="children-comment"/>

        <div class="foot">
          <div class="time">
            {{this.$calc.filters.date(comment.comment_time)}}
          </div>
          <div v-if="comment.target_id" class="conversation" @click="on_click_conversation_detail">
            对话详情
          </div>
          <div class="interact">

            <img v-if="show_comment_num" @click="on_click_content"
                 class="interact-icon" src="~assets/img/comment.svg" height="16" alt="">
            <div v-if="show_comment_num" @click="on_click_content"
                 class="interact-text">{{comment.comment_num}}
            </div>

            <div class="flex-center" @click="on_vote(1)">
              <img
                class="interact-icon"
                :class="{active:comment.is_up===true}"
                src="~assets/img/up.svg"
                height="16"
                alt="">
              <div class="interact-text" :class="{active:comment.is_up===true}">{{comment.up_num}}</div>
            </div>

            <div class="flex-center" @click="on_vote(0)">
              <img
                class="interact-icon"
                :class="{active:comment.is_up===false}"
                src="~assets/img/down.svg"
                height="16"
                alt="">
              <div class="interact-text" :class="{active:comment.is_up===false}">{{comment.down_num}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "CommonCommentCard",
    props: {
      article: null,
      parent: null,
      comment: null,
      show_comment_num: null,
    },
    emits: [
      "onClickOption",
      "onClickContent",
      "onVote",
      "onClickConversationDetail",
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
      on_click_content() {
        this.$emit('onClickContent', this.parent || this.comment, this.parent && this.comment)
      },
      on_vote(is_up) {
        this.$emit('onVote', is_up, this.comment)
      },
      on_click_conversation_detail() {
        this.$emit('onClickConversationDetail', this.comment.target_id)
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
  }

  .interact {
    display: flex;
    justify-content: right;
    overflow: hidden;
  }

  .time {
    line-height: 40px;
    font-size: 12px;
    color: #666666;
  }

  .interact-icon {
    margin: 12px 0;
    position: relative;
    transform: translateX(500px);
    filter: drop-shadow(-500px 0 #999);
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
  }

  .interact-text {
    line-height: 40px;
    float: right;
    min-width: 30px;
    color: #999;
  }

  .conversation {
    line-height: 40px;
    font-size: 12px;
    color: #666666;
  }


  .active {
    filter: drop-shadow(-500px 0 #4ebaee);
    color: #4ebaee;
  }
</style>