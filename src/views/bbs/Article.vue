<template>
  <div class="animation-wrap">
    <var-app-bar
      class="app-bar"
      color="#f4f5f9"
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
          文章详情
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

    <Transition name="slide-fade">
      <div class="article-wrap" v-if="article_ready">
        <simple-author-card :author="article.author"/>
        <div class="title break">
          {{article.title}}
        </div>
        <div class="time">
          <span>文章发表:{{this.$calc.filters.date(article.create_time)}}</span>
          <span v-if="delta>60">
          <span style="font-weight: lighter">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          <span>最后更新:{{this.$calc.filters.date(article.update_time)}}</span>
        </span>
        </div>
        <div class="w-container content" v-html="this.$xss(article.content)"/>
        <div class="foot">
          <div class="chip">
            <var-chip size="small" id="comment">{{article.category.category}}</var-chip>
          </div>
          <div class="view">浏览数：{{article.view_num}}</div>
        </div>
      </div>
    </Transition>

    <Transition name="slide-fade">
      <div class="all-comment" v-if="article_ready">
        <var-sticky z-index="0" :offset-top="54">
          <div class="select">
            <div class="author">
              <var-tabs v-model:active="is_author" @change="change_author">
                <var-tab>全部评论</var-tab>
                <var-tab>只看楼主</var-tab>
              </var-tabs>
            </div>

            <div class="order">
              <var-menu :offset-y="25" :offset-x="-10" v-model:show="show_order">
                <div @click="show_order = !show_order">{{order_text}}</div>
                <template #menu>
                  <div class="menu">
                    <var-cell @click="change_order(order)" v-for="order in order_list">{{order.text}}
                    </var-cell>
                  </div>
                </template>
              </var-menu>
              <var-icon name="menu-down"/>
            </div>

          </div>
          <var-divider margin="0"/>
        </var-sticky>
        <var-list
          :finished="root_comment_finished"
          v-model:loading="root_comment_loading"
          @load="root_comment_load"
        >
          <div v-for="root_comment in root_comment_list">
            <common-comment-card
              :article="article"
              :parent="null"
              :comment="root_comment"
              :show_comment_num="true"
              @onClickOption="open_comment_option"
              @onClickContent="open_comment_editor"
              @onVote="vote_comment"
            >
              <template v-if="root_comment.comment_num" #children-comment>
                <div class="children-wrap" @click="open_children_comment(root_comment)">
                  <simple-comment-card
                    :article="article"
                    :comment="children_comment"
                    v-for="children_comment in root_comment.children_comment"
                  />
                  <div class="comment-tip" v-if="root_comment.comment_num>2">全部{{root_comment.comment_num}}条评论...</div>
                </div>
              </template>
            </common-comment-card>
            <var-divider margin="0" :inset="60"/>
          </div>
        </var-list>
      </div>
    </Transition>


    <div v-if="article" class="interact var-elevation--5">
      <div class="fake" @click="open_editor(null,null)">
        我有话要说...
      </div>
      <div class="up-down">
        <div class="flex-center" @click="vote_article(1)">
          <img class="interact-icon"
               :class="{active:article.is_up===true}"
               src="~assets/img/up.svg"
               height="20"
               alt="">
          <div class="interact-text" :class="{active:article.is_up===true}">{{article.up_num}}</div>
        </div>

        <div class="flex-center" @click="vote_article(0)">
          <img class="interact-icon"
               :class="{active:article.is_up===false}"
               src="~assets/img/down.svg"
               height="20"
               alt="">
          <div class="interact-text" :class="{active:article.is_up===false}">{{article.down_num}}</div>
        </div>
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

    <var-popup position="bottom" v-model:show="show_article_option">
      <div class="option" v-if="is_self">
        <div class="option-item" @click="this.$router.push({path:'/bbs/post-article',query:{id:article.id}})">
          <var-icon name="content-copy" size="25"/>
          <div class="option-text">编辑</div>
        </div>
        <div class="option-item" @click="delete_article">
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

    <var-popup position="bottom" style="border-radius: 5px 5px 0 0;width: 100vw" v-model:show="show_children_comment">
      <div class="children-detail">
        <div class="children-detail-head">
          <div class="children-detail-title">评论详情</div>
          <var-icon size="25" name="window-close" @click="show_children_comment=false"/>
        </div>
        <common-comment-card
          :article="article"
          :parent="null"
          :comment="opened_comment"
          :show_comment_num="true"
          @onClickOption="open_comment_option"
          @onClickContent="open_comment_editor"
          @onVote="vote_comment"
        />
        <var-divider/>
        <var-list
          :finished="children_comment_finished"
          v-model:loading="children_comment_loading"
          @load="children_comment_load"
        >
          <div v-for="children_comment in children_comment_list">
            <common-comment-card
              :article="article"
              :parent="opened_comment"
              :comment="children_comment"
              :show_comment_num="false"
              @onClickOption="open_comment_option"
              @onClickContent="open_comment_editor"
              @onVote="vote_comment"
              @onClickConversationDetail="load_conversation"
            />
            <var-divider inset="60" margin="0"/>
          </div>
        </var-list>
        <div style="height: 200px"/>
      </div>
    </var-popup>

    <var-popup style="border-radius: 10px;width: 80vw;max-height: 80vh" position="center" v-if="conversation_list"
               v-model:show="show_conversation">
      <common-comment-card
        :article="article"
        :parent="opened_comment"
        :comment="conversation"
        :show_comment_num="false"
        :hide_conversation="k!==0"
        @onClickOption="open_comment_option"
        @onClickContent="open_comment_editor"
        @onVote="vote_comment"
        @onClickConversationDetail="load_conversation"
        v-for="(conversation,k) in conversation_list"
      />
    </var-popup>
  </div>
</template>

<script>

  import SimpleAuthorCard from "components/card/SimpleAuthorCard";
  import CommentEditor from "components/input/CommentEditor";
  import CommonCommentCard from "components/card/CommonCommentCard";
  import SimpleCommentCard from "../../components/card/SimpleCommentCard";

  export default {
    name: "Article",
    components: {
      SimpleCommentCard,
      CommonCommentCard,
      CommentEditor,
      SimpleAuthorCard
    },
    watch: {
      show_editor(newValue, oldValue) {
        this.$store.commit("toggle_hide")
        if (!newValue) {
          this.parent = this.target == null
        }
      },
      show_conversation(newValue, oldValue) {
        if (!newValue) {
          this.conversation_list = []
        }
      },
      show_children_comment(newValue, oldValue) {
        if (!newValue) {
          this.opened_comment = null
        }
      },
      is_author() {
        this.root_comment_clear()
      }
    },
    data() {
      return {
        article: null,
        article_ready: false,
        show_article_option: false,

        is_author: 0,
        show_order: false,
        ordering: "-comment_time",
        order_text: "最新发布",
        order_list: [
          {
            text: "最新发布",
            ordering: "-comment_time",
          },
          {
            text: "最多点赞",
            ordering: "-up_num",
          },
          {
            text: "最多评论",
            ordering: "-comment_num",
          },
        ],

        show_editor: false,

        root_comment_finished: false,
        root_comment_loading: false,
        root_comment_next: null,
        root_comment_list: [],

        opened_comment: null,
        show_children_comment: false,
        children_comment_finished: false,
        children_comment_loading: false,
        children_comment_next: null,
        children_comment_list: [],

        parent: null,
        target: null,

        is_option_comment_self: false,
        option_comment: null,
        show_comment_option: false,

        show_conversation: false,
        conversation_list: [],

        scrollTop: 0
      }
    },
    computed: {
      delta() {
        return (new Date(this.article.update_time).getTime()) - (new Date(this.article.create_time).getTime())
      },
      is_self() {
        return this.article.author.id === this.$store.state.user.id
      }
    },
    methods: {
      open_editor(parent, target) {
        if (!this.$store.state.is_login) {
          this.$router.push({path: '/login', query: {back: true}})
          return
        }
        this.parent = parent
        this.target = target
        this.show_editor = true
      },
      root_comment_clear() {
        this.root_comment_list = []
        this.root_comment_finished = false
        this.root_comment_loading = true
        this.root_comment_next = null
      },
      children_comment_clear() {
        this.children_comment_list = []
        this.children_comment_finished = false
        this.children_comment_next = null
      },
      root_comment_reload() {
        this.root_comment_clear()
        this.root_comment_load()
      },
      change_order(order) {
        this.ordering = order.ordering
        this.order_text = order.text
        this.show_order = false
        this.root_comment_clear()
        this.root_comment_reload()
      },
      change_author(){
        this.root_comment_reload()
      },
      root_comment_load() {
        let url = `bbs/article/${this.$route.params.id}/comment/?ordering=${this.ordering}`
        if (this.is_author) {
          url += `&author_id=${this.article.author.id}`
        }
        this.$request.api.get(
          this.root_comment_next || url,
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
      vote_article(is_up) {
        if (!this.$store.state.is_login) {
          this.$router.push({path: "/login", query: {back: true}})
          return
        }
        this.$request.api.post(
          `/bbs/article/${this.$route.params.id}/vote/`,
          {
            is_up
          }).then(res => {
          if (res.data.code !== 124) {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000
            })
          } else {
            this.$calc.up_down(is_up, this.article)
          }
        })
      },
      delete_article() {
        this.$dialog("是否删除文章").then(res => {
          if (res !== "confirm") return;
          this.$request.api.delete(
            `bbs/article/${this.article.id}`
          ).then(res => {
            if (res.data.code === 115) {
              this.$tip({
                content: "已删除",
                type: "success",
                duration: 1000
              })
              this.$router.replace("/bbs")
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
      submit_comment() {
        if (this.$refs.editor.editor.isEmpty()) return;

        if (!this.parent) {
          this.$request.api.post(
            `bbs/article/${this.$route.params.id}/comment/`,
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
            `bbs/article/${this.$route.params.id}/comment/${this.parent.id}/children_comment/`,
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
      children_comment_load() {
        this.$request.api.get(
          this.children_comment_next || `/bbs/article/${this.article.id}/comment/${this.opened_comment.id}/children_comment/`,
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
      open_comment_option(comment) {
        this.is_option_comment_self = comment.author.id === this.$store.state.user.id
        this.option_comment = comment
        this.show_comment_option = true
      },
      open_comment_editor(parent, target) {
        this.open_editor(parent, target)
      },
      vote_comment(is_up, comment) {
        if (!this.$store.state.is_login) {
          this.$router.push({path: "/login", query: {bakc: true}})
          return
        }
        this.$request.api.post(
          `/bbs/article/${this.$route.params.id}/comment/${comment.id}/vote/`,
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
      open_children_comment(parent) {
        this.children_comment_clear()
        this.opened_comment = parent
        this.show_children_comment = true
      },
      load_conversation(comment) {
        this.show_conversation = true
        if (!this.conversation_list.length) {
          this.conversation_list.push(comment)
        }
        this.$request.api.get(
          `bbs/article/${this.article.id}/comment/${this.opened_comment.id}/children_comment/${comment.target_id}`
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
            url = `bbs/article/${this.article.id}/comment/${this.opened_comment.id}/children_comment/${this.option_comment.id}`
          } else {
            url = `bbs/article/${this.article.id}/comment/${this.option_comment.id}/`
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
    },
    mounted() {
      let _this = this
      document.addEventListener("scroll", () => {
        _this.show_order = false
      })
    },
    created() {
      this.$request.api.get(
        `/bbs/article/${this.$route.params.id}/`,
      ).then(res => {
        if (res.data.code === 111) {
          this.article = res.data.result
          this.article_ready = true
        } else {
          this.$tip({
            content: res.data.msg,
            type: "warning",
            duration: 1000
          })
        }
      })
    },
  }
</script>

<style scoped>

  .bar-text {
    font-weight: bolder;
  }

  .app-bar {
    width: 100vw;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
  }

  .article-wrap {
    padding: 80px 15px 25px;
    background-color: white;
    border-radius: 0 0 2px 2px;
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

  .foot {
    display: flex;
    justify-content: space-between;
    line-height: 30px;
  }

  .chip {
    line-height: 30px;
  }

  .view {
    font-size: 14px;
    color: #666;
    margin-right: 5px;
  }

  .all-comment {
    margin-top: 10px;
    min-height: 80vh;
    background-color: white;
    padding-bottom: 200px;
  }

  .select {
    background-color: white;
    z-index: 10;
    display: flex;
    line-height: 44px;
    justify-content: space-between;
  }

  .author {
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

  .submit {
    margin: 10px;
    float: right;
  }

  .comment {
    font-size: 14px;
    margin: 9px;
    color: #666;
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

  .order {
    display: flex;
    justify-content: right;
    line-height: 44px;
    font-size: 14px;
  }

  .menu {
    background-color: white;
  }

  .up-down {
    display: flex;
    justify-content: right;
    align-items: center;
  }

  .interact-icon {
    position: relative;
    transform: translateX(500px);
    filter: drop-shadow(-500px 0 #333);
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
  }

  .interact-text {
    float: right;
    min-width: 30px;
    color: #333;
  }

  .active {
    filter: drop-shadow(-500px 0 #4ebaee);
    color: #4ebaee;
  }

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

  .comment-tip {
    text-align: right;
    line-height: 20px;
    font-size: 13px;
    color: #666666;
  }
</style>

<style>
  .var-tabs {
    background: transparent;
  }

  .mask {
    background-color: rgba(0, 0, 0, .16);
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
  }

  .var-tabs__indicator {
    z-index: 0;
  }
</style>