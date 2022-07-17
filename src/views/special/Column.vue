<template>
  <div class="animation-wrap">
    <var-app-bar
      class="app-bar"
      color="white"
      text-color="#333"
      title-position="center"
    >
      <template #left>
        <var-button
          round
          text
          color="transparent"
          text-color="#333"
          @click="this.$router.return('/bbs')"
        >
          <var-icon name="chevron-left" :size="24"/>
        </var-button>
      </template>
      <template #default>
        <div class="bar-text">
          专栏内容
        </div>
      </template>
      <template #right>
        <var-button
          round
          text
          color="transparent"
          text-color="#333"
          @click="show_article_option=true"
        >
          <var-icon name="dots-vertical" :size="24"/>
        </var-button>
      </template>
    </var-app-bar>

    <div style="height: 54px;"/>
    <Transition name="slide-fade">
      <div class="content" v-if="column_ready">
        <div class="title break">{{column.title}}</div>

        <div class="time">
          <span>文章发表:{{this.$calc.filters.date(column.create_time)}}</span>
          <span v-if="delta>60">
          <span style="font-weight: lighter">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          <span>最后更新:{{this.$calc.filters.date(column.update_time)}}</span>
        </span>
        </div>

        <div class="w-container" v-html="this.$xss(column.content)" @click="click_column"/>

        <div class="tags">
          <a-tag class="tag" checkable color="arcoblue" v-for="tag in column.tag">{{tag.name}}</a-tag>
        </div>

        <var-divider margin="0"/>

        <simple-author-card class="author" :author="column.author"/>
      </div>
    </Transition>

    <div class="all-comment">
      <div class="comment-text">评论</div>
      <var-divider margin="0"/>
      <var-list
        :finished="root_comment_finished"
        v-model:loading="root_comment_loading"
        @load="root_comment_load"
      >
        <div v-for="root_comment in root_comment_list">
          <common-comment-card
            :article="column"
            :parent="null"
            :comment="root_comment"
            :show_comment_num="true"
            @onClickOption="open_comment_option"
            @onClickContent="open_comment_editor"
            @onVote="vote_comment"
            @onClickUser="click_user"
            @onClickImg="click_img"
          >
            <template v-if="root_comment.comment_num" #children-comment>
              <div class="children-wrap" @click="open_children_comment(root_comment)">
                <simple-comment-card
                  :article="column"
                  :comment="children_comment"
                  v-for="children_comment in root_comment.children_comment"
                />
                <div class="comment-tip" v-if="root_comment.comment_num>2">全部{{root_comment.comment_num}}条评论...</div>
              </div>
            </template>

          </common-comment-card>
        </div>
      </var-list>
    </div>

    <div v-if="column" class="interact var-elevation--5">
      <div class="fake" @click="open_editor(null,null)">
        我有话要说...
      </div>
      <div class="up-down">
        <icon-thumb-up :class="{active:column.is_up===true}" @click="vote_column(1)" :strokeWidth="3" size="24"/>
        <div :class="{active:column.is_up===true}" @click="vote_column(1)" class="number">{{column.up_num}}</div>
        <icon-thumb-down :class="{active:column.is_up===false}" @click="vote_column(0)" :strokeWidth="3" size="24"/>
        <div :class="{active:column.is_up===false}" @click="vote_column(0)" class="number">{{column.down_num}}</div>
      </div>
    </div>

    <var-popup style="border-radius: 10px 10px 0 0" overlay-class="mask" position="bottom" v-model:show="show_editor">
      <div v-if="target" class="comment">回复:{{target.author.username}}</div>
      <div v-else class="comment">发表评论</div>
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

    <var-popup position="bottom" style="border-radius: 5px 5px 0 0;width: 100vw" v-model:show="show_children_comment">
      <div class="children-detail">
        <div class="children-detail-head">
          <div class="children-detail-title">评论详情</div>
          <var-icon size="25" name="window-close" @click="show_children_comment=false"/>
        </div>
        <common-comment-card
          :article="column"
          :parent="null"
          :comment="opened_comment"
          :show_comment_num="true"
          @onClickOption="open_comment_option"
          @onClickContent="open_comment_editor"
          @onVote="vote_comment"
          @onClickUser="click_user"
          @onClickImg="click_img"
        />
        <var-divider/>
        <var-list
          :finished="children_comment_finished"
          v-model:loading="children_comment_loading"
          @load="children_comment_load"
        >
          <div v-for="children_comment in children_comment_list">
            <common-comment-card
              :article="column"
              :parent="opened_comment"
              :comment="children_comment"
              :show_comment_num="false"
              @onClickOption="open_comment_option"
              @onClickContent="open_comment_editor"
              @onVote="vote_comment"
              @onClickConversationDetail="load_conversation"
              @onClickUser="click_user"
              @onClickImg="click_img"
            />
            <var-divider inset="60" margin="0"/>
          </div>
        </var-list>
        <div style="height: 200px"/>
      </div>
    </var-popup>

    <var-popup position="bottom" v-model:show="show_comment_option">
      <div class="option" v-if="is_option_comment_self">
        <div class="option-item" @click="delete_comment">
          <var-icon name="trash-can-outline" size="25"/>
          <div class="option-text">删除</div>
        </div>
      </div>
      <div class="option" v-else>
        <div class="option-item">
          <var-icon name="alert-outline" size="25"/>
          <div class="option-text">举报</div>
        </div>
      </div>
    </var-popup>

    <var-popup style="border-radius: 10px;width: 80vw;max-height: 80vh" position="center" v-if="conversation_list"
               v-model:show="show_conversation">
      <common-comment-card
        :article="column"
        :parent="opened_comment"
        :comment="conversation"
        :show_comment_num="false"
        :hide_conversation="k!==0"
        @onClickOption="open_comment_option"
        @onClickContent="open_comment_editor"
        @onVote="vote_comment"
        @onClickConversationDetail="load_conversation"
        v-for="(conversation,k) in conversation_list"
        @onClickUser="click_user"
        @onClickImg="click_img"
      />
    </var-popup>
    <var-image-preview style="transition-duration: 0.5s" closeable :images="images" v-model:show="show_img"/>
  </div>
</template>

<script>
  import SimpleAuthorCard from "components/card/SimpleAuthorCard";
  import CommentEditor from "components/input/CommentEditor";
  import CommonCommentCard from "components/card/CommonCommentCard";
  import SimpleCommentCard from "components/card/SimpleCommentCard";

  export default {
    name: "Column",
    components: {
      SimpleCommentCard,
      CommonCommentCard,
      SimpleAuthorCard,
      CommentEditor
    },
    watch:{
      show_img(newValue, oldValue) {
        this.$calc.mutex(this.$store, newValue, oldValue)
      },
      show_article_option(newValue, oldValue) {
        this.$calc.mutex(this.$store, newValue, oldValue)
      },
      show_comment_option(newValue, oldValue) {
        this.$calc.mutex(this.$store, newValue, oldValue)
      },
      show_editor(newValue, oldValue) {
        this.$store.commit("toggle_hide")
        if (!newValue) {
          this.parent = this.target == null
        }
        this.$calc.mutex(this.$store, newValue, oldValue)
      },
      show_conversation(newValue, oldValue) {
        if (!newValue) {
          this.conversation_list = []
        }
        this.$calc.mutex(this.$store, newValue, oldValue)
      },
      show_children_comment(newValue, oldValue) {
        if (!newValue) {
          this.opened_comment = null
        }
        this.$calc.mutex(this.$store, newValue, oldValue)
      },
    },
    data() {
      return {
        column: null,
        column_ready: false,
        images: [],
        show_img: false,
        parent: null,
        target: null,
        show_editor: false,
        root_comment_list: [],
        root_comment_finished: false,
        root_comment_loading: false,
        is_option_comment_self: null,
        option_comment: null,
        show_comment_option: false,
        opened_comment: null,
        show_children_comment: false,
        children_comment_list: [],
        children_comment_finished: false,
        children_comment_loading: false,
        children_comment_next: null,
        show_conversation:false,
        conversation_list:[],
      }
    },
    computed: {
      delta() {
        return (new Date(this.column.update_time).getTime()) - (new Date(this.column.create_time).getTime())
      },
    },
    methods: {
      load_conversation(comment) {
        this.show_conversation = true
        if (!this.conversation_list.length) {
          this.conversation_list.push(comment)
        }
        this.$request.api.get(
          `special/column/${this.column.id}/comment/${this.opened_comment.id}/children_comment/${comment.target_id}`
        ).then(res => {
          if (res.data.code === 116) {
            this.conversation_list.unshift(res.data.result)
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000
            })
          }
        })
      },
      delete_comment() {
        this.$dialog("是否删除评论").then(res => {
          if (res !== "confirm") return;
          let url
          if (this.opened_comment) {
            url = `special/column/${this.column.id}/comment/${this.opened_comment.id}/children_comment/${this.option_comment.id}`
          } else {
            url = `special/column/${this.column.id}/comment/${this.option_comment.id}/`
          }
          this.$request.api.delete(
            url
          ).then(res => {
            if (res.data.code === 119) {
              this.$tip({
                content: "已删除",
                type: "success",
                duration: 1000
              })
              let new_root_comment_list = []
              if (this.opened_comment) {
                for (let i of this.children_comment_list) {
                  if (i.id !== this.option_comment.id) {
                    new_root_comment_list.push(i)
                  }
                }
                this.children_comment_list = new_root_comment_list
              } else {
                for (let i of this.root_comment_list) {
                  if (i.id !== this.option_comment.id) {
                    new_root_comment_list.push(i)
                  }
                }
                this.root_comment_list = new_root_comment_list
              }
              this.show_comment_option = false
            } else {
              this.$tip({
                content: res.data.msg,
                type: "warning",
                duration: 1000
              })
            }
          })
        })
      },
      children_comment_load() {
        this.$request.api.get(
          this.children_comment_next || `/special/column/${this.column.id}/comment/${this.opened_comment.id}/children_comment/`,
        ).then(res => {
          if (res.data.code === 117) {
            for (let i of res.data.result.results) {
              this.children_comment_list.push(i)
            }
            this.children_comment_next = res.data.result.next
            this.children_comment_loading = false
            this.children_comment_finished = !Boolean(this.children_comment_next)
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
        })
      },
      children_comment_clear() {
        this.children_comment_list = []
        this.children_comment_finished = false
        this.children_comment_next = null
      },
      open_children_comment(parent) {
        this.children_comment_clear()
        this.opened_comment = parent
        this.show_children_comment = true
      },
      open_comment_option(comment) {
        this.is_option_comment_self = comment.author.id === this.$store.state.user.id
        this.option_comment = comment
        this.show_comment_option = true
      },
      open_comment_editor(parent, target) {
        this.open_editor(parent, target)
      },
      click_user(id) {
        this.$router.push(`/user/${id}`)
      },
      vote_comment(is_up, comment) {
        if (!this.$store.state.is_login) {
          this.$router.push({path: "/login", query: {bakc: true}})
          return
        }
        this.$request.api.post(
          `/special/column/${this.$route.params.id}/comment/${comment.id}/vote/`,
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
      root_comment_load() {
        this.$request.api.get(
          this.root_comment_next || `special/column/${this.$route.params.id}/comment/`,
        ).then(res => {
          if (res.data.code === 117) {
            for (let i of res.data.result.results) {
              this.root_comment_list.push(i)
            }
            if (res.data.result.next) {
              this.root_comment_next = res.data.result.next
            }
            this.root_comment_finished = !Boolean(res.data.result.next)
            this.root_comment_loading = false
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
        })
      },
      vote_column(is_up) {
        if (!this.$store.state.is_login) {
          this.$router.push({path: "/login", query: {back: true}})
          return
        }
        this.$request.api.post(
          `/special/column/${this.$route.params.id}/vote/`,
          {
            is_up
          }).then(res => {
          if (res.data.code !== 160) {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000
            })
          } else {
            this.$calc.up_down(is_up, this.column)
          }
        })
      },
      open_editor(parent, target) {
        if (!this.$store.state.is_login) {
          this.$router.push({path: '/login', query: {back: true}})
          return
        }
        this.parent = parent
        this.target = target
        this.show_editor = true
      },
      submit_comment() {
        if (this.$refs.editor.editor.isEmpty()) return;

        if (!this.parent) {
          this.$request.api.post(
            `special/column/${this.$route.params.id}/comment/`,
            {
              content: this.$refs.editor.editor.getHtml()
            }
          ).then(res => {
            if (res.data.code === 118) {
              this.$tip({
                content: "评论成功",
                type: "success",
                duration: 1000,
              })
              this.show_editor = false
              res.data.result.new = true
              this.root_comment_list.unshift(res.data.result)
            } else {
              this.$tip({
                content: res.data.msg,
                type: "warning",
                duration: 1000,
              })
            }
          })
        } else {
          this.$request.api.post(
            `special/column/${this.$route.params.id}/comment/${this.parent.id}/children_comment/`,
            {
              content: this.$refs.editor.editor.getHtml(),
              target_id: this.target?.id
            }
          ).then(res => {
            if (res.data.code === 118) {
              this.$tip({
                content: "评论成功",
                type: "success",
                duration: 1000,
              })
              res.data.result.new = true
              if (this.target) {
                this.children_comment_list.push(res.data.result)
              } else {
                this.parent.comment_num++
                this.children_comment_list.push(res.data.result)
                this.parent.children_comment.push(res.data.result)
              }
              this.show_editor = false
            } else {
              this.$tip({
                content: res.data.msg,
                type: "warning",
                duration: 1000,
              })
            }
          })
        }
      },
      click_img(images) {
        this.images = images
        this.show_img = true
      },
      click_column(ev) {
        if (ev.target.tagName === "IMG") {
          this.click_img([ev.target.getAttribute("src")])
        }
      },
    },
    created() {
      this.$request.api.get(
        `/special/column/${this.$route.params.id}/`,
      ).then(res => {
        if (res.data.code === 158) {
          this.column = res.data.result
          this.column_ready = true
        } else {
          this.$tip({
            content: res.data.msg,
            type: "warning",
            duration: 1000
          })
        }
      })
    }
  }
</script>

<style scoped>
  .children-wrap {
    background-color: #f4f5f9;
    border-radius: 5px;
  }

  .children-detail {
    height: 85vh;
    padding: 10px;
  }

  .children-detail-head {
    line-height: 40px;
    display: flex;
    justify-content: space-between;
  }

  .children-detail-title {
    font-size: 16px;
  }

  .option {
    padding: 20px 10px;
    display: flex;
    justify-content: left;
  }

  .option-item {
    margin: 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .children-wrap {
    background-color: #f4f5f9;
    border-radius: 5px;
  }

  .all-comment {
    min-height: 80vh;
    margin: 30px 0;
    background-color: white;
    border-radius: 5px 5px 0 0;
  }

  .comment {
    font-size: 14px;
    margin: 9px;
    color: #666;
  }

  .comment-text {
    padding: 10px;
  }

  .submit {
    margin: 10px;
    float: right;
  }

  .active {
    color: #4ebaee;
  }

  .number {
    margin: 0 16px 0 3px;
    font-size: 18px;
  }

  .up-down {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .interact {
    position: fixed;
    display: flex;
    justify-content: space-between;
    left: 0;
    bottom: 0;
    width: 100vw;
    padding: 5px;
    background-color: #f6f6f6;
  }

  .fake {
    background-color: white;
    margin-right: 30px;
    padding: 7px 10px;
    font-size: 14px;
    flex-grow: 1;
    border-radius: 2px;
    color: #777777;
  }

  .app-bar {
    width: 100vw;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
  }

  .bar-text {
    font-family: Number, "85W", sans-serif;
    font-size: 18px;
    color: #06f;
  }

  .title {
    font-size: 20px;
    font-weight: 500;
    line-height: 24px;
    margin: 10px 0;
  }

  .time {
    text-align: center;
    font-size: 12px;
    color: #666666;
    line-height: 40px;
  }

  .content {
    padding: 10px;
    background-color: #fafafa;
    border-radius: 0 0 10px 10px;
  }

  .tags {
    margin: 10px 0;
  }

  .tag {
    margin: 3px;
  }

  .author {
    padding: 10px;
  }
</style>