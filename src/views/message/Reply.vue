<template>
  <div class="animation-wrap">
    <var-app-bar class="app-bar" color="white" text-color="#333" title="回复我的">
      <template #left>
        <var-button
          round
          text
          color="transparent"
          text-color="#333"
          @click="this.$router.return('/message')"
        >
          <var-icon name="chevron-left" :size="24"/>
        </var-button>
      </template>
    </var-app-bar>

    <div class="container">
      <var-list
        :finished="finished"
        v-model:loading="loading"
        @load="load"
        :immediate-check="false"
      >
        <div :key="reply" v-for="reply in reply_list">
          <div v-if="reply.origin===0||reply.origin===1">
            <transition :name="animation(reply)" appear>
              <reply-b-b-s-comment-card
                :class="{new:!reply.is_viewed}"
                @onVote="vote_comment"
                @onClickComment="open_editor"
                @onDelete="delete_reply"
                class="comment-card"
                :comment="reply"
                v-if="remove.indexOf(reply.id)===-1"
                v-ripple="{ color: '#ccc' }"
              />
            </transition>
          </div>

          <div v-if="reply.origin===2||reply.origin===3">
            <transition :name="animation(reply)" appear>
              <reply-special-comment-card
                :class="{new:!reply.is_viewed}"
                @onVote="vote_comment"
                @onClickComment="open_editor"
                @onDelete="delete_reply"
                class="comment-card"
                :comment="reply"
                v-if="remove.indexOf(reply.id)===-1"
                v-ripple="{ color: '#ccc' }"
              />
            </transition>
          </div>

        </div>
      </var-list>
    </div>

    <var-popup style="border-radius: 10px 10px 0 0" overlay-class="mask" position="bottom" v-model:show="show_editor">
      <div class="comment">回复:{{target?.author.username||parent.author.username}}</div>
      <comment-editor ref="editor"/>
      <var-button
        class="submit"
        size="small"
        type="info"
        @click="submit_comment"
      >
        发布
      </var-button>
    </var-popup>
  </div>

</template>

<script>
  import ReplyBBSCommentCard from "components/card/ReplyBBSCommentCard";
  import CommentEditor from "components/input/CommentEditor";
  import ReplySpecialCommentCard from "components/card/ReplySpecialCommentCard";

  export default {
    name: "Reply",
    components: {
      ReplySpecialCommentCard,
      CommentEditor,
      ReplyBBSCommentCard
    },
    data() {
      return {
        type: null,
        reply_list: [],
        path_prefix: ["/bbs/article", "/special/column"],
        finished: false,
        loading: true,
        next: null,
        post: null,
        parent: null,
        target: null,
        show_editor: false,
        remove: []
      }
    },
    methods: {
      animation(like) {
        if (!like.is_viewed) return "slide-fade"
        return "bloom"
      },
      load() {
        this.$request.api.get(
          this.next || `/message/reply`
        ).then(res => {
          if (res.data.code === 127) {
            for (let i of res.data.result.results) {
              this.reply_list.push(i)
            }
            this.next = res.data.result.next
            this.loading = false
            this.finished = !Boolean(this.next)
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
        })
      },
      vote_comment(is_up, type, post, comment) {
        this.$request.api.post(
          `${this.path_prefix[type]}/${post.id}/comment/${comment.id}/vote/`,
          {
            is_up
          }).then(res => {
          if (res.data.code !== 125) {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000
            })
          } else {
            this.$calc.up_down(is_up, comment)
          }
        })
      },
      open_editor(type, post, parent, target) {
        this.type = type
        this.post = post
        this.parent = parent
        this.target = target
        this.show_editor = true
      },
      submit_comment() {
        if (this.$refs.editor.editor.isEmpty()) return;
        let data = {
          content: this.$refs.editor.editor.getHtml(),
        }

        if (this.target) {
          data.target_id = this.target.id
        }
        this.$request.api.post(
          `${this.path_prefix[this.type]}/${this.post.id}/comment/${this.parent.id}/children_comment/`,
          data
        ).then(res => {
          if (res.data.code === 118) {
            this.$tip({
              content: "评论成功",
              type: "success",
              duration: 1000,
            })
            this.show_editor = false
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
        })
      },
      delete_reply(reply) {
        this.$dialog("是否删除记录").then(res => {
          if (res !== "confirm") return;
          this.$request.api.delete(
            `message/reply/${reply.id}/`,
          ).then(res => {
            if (res.data.code === 143) {
              this.$tip({
                content: "已删除记录",
                type: "success",
                duration: 1000,
              })
              this.remove.push(reply.id)
            } else {
              this.$tip({
                content: res.data.msg,
                type: "warning",
                duration: 1000,
              })
            }
          })
        })
      }
    },
    created() {
      this.load()
      if (this.$store.state.message) {
        this.$store.state.message.reply = 0
      } else {
        this.$request.api.get(
          "user/self/message/"
        ).then(res => {
          this.$store.commit("message", res.data.result)
        })
      }
    }
  }
</script>

<style scoped>
  .app-bar {
    width: 100vw;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
  }

  .container {
    padding-top: 54px;
    min-height: 120vh;
    background-color: white;
  }

  .comment-card {
    border-bottom: 1px solid #f0f1f5;
  }

  .submit {
    margin: 10px;
    float: right;
  }

  .comment {
    font-size: 14px;
    margin: 9px;
    color: #666;
  }
</style>