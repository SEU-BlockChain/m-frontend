<template>
  <div class="animation-wrap">
    <var-app-bar
      class="app-bar"
      color="#f0f1f5"
      :elevation="false"
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
      <template #right>
        <var-button
          text
          text-color="#333"
          @click="show=true"
          v-if="this.update_id===undefined"
        >
          草稿箱
        </var-button>
        <var-button
          text outline
          size="small"
          type="primary"
          @click="save_draft"
          v-if="this.update_id===undefined"
          :disabled="!title"
        >
          保存为草稿
        </var-button>
        <div style="width: 10px"/>
        <var-button
          size="small"
          type="success"
          @click="post_article"
          :disabled="!title"
        >
          发布
        </var-button>
      </template>
    </var-app-bar>
    <div class="wrap">
      <var-input
        class="title"
        placeholder="标题（必填）"
        v-model="title"
        blur-color="#ccc"
        :maxlength="50"
        clearable/>
      <article-editor ref="editor"/>
    </div>
    <div class="category var-elevation--5" v-if="category_list.length">
      <var-radio-group v-model="category">
        <var-radio v-for="category in category_list" :disabled="this.update_id!==undefined"
                   :checked-value="category.id">{{category.category}}
        </var-radio>
      </var-radio-group>
    </div>

    <var-popup style="border-radius: 10px" v-model:show="show">
      <div class="drafts">
        <var-list
          :finished="finished"
          v-model:loading="loading"
          @load="load_drafts"
        >
          <div :key="draft" v-for="draft in draft_list">
            <div class="draft" @click="get_draft(draft.id)">
              <div class="draft-info">
                <div class="draft-title">
                  <var-chip size="small" type="info" :round="false">{{draft.category.category}}</var-chip>
                  {{this.$calc.filters.max_width(draft.title,15) }}
                </div>
                <var-button
                  text outline
                  size="small"
                  type="danger"
                  @click.stop="delete_draft(draft.id,true)"
                >删除
                </var-button>
              </div>
              <div class="time">{{this.$calc.filters.date(draft.update_time)}}</div>
            </div>
            <var-divider margin="0"/>
          </div>
        </var-list>
      </div>
    </var-popup>
  </div>
</template>

<script>
  import ArticleEditor from "components/input/ArticleEditor";
  import {SlateTransforms} from '@wangeditor/editor'
  import request from "../../assets/js/request";

  export default {
    name: "PostArticle",
    components: {
      ArticleEditor
    },
    data() {
      return {
        title: "",
        category: null,
        show: false,
        draft_list: [],
        finished: false,
        loading: false,
        next: null,
        draft_id: null,
        update_id: this.$route.query.id,
        category_list: []
      }
    },
    methods: {
      clear_draft() {
        this.draft_list = []
        this.next = null
        this.finished = false
        this.loading = false
      },
      is_valid() {
        return this.title && !this.$refs.editor.editor.isEmpty()
      },
      save_draft() {
        if (!this.is_valid()) return
        if (this.draft_id) {
          this.$request.api.put(
            `/bbs/draft/${this.draft_id}/`,
            {
              title: this.title,
              category_id: this.category,
              raw_content: JSON.stringify(this.$refs.editor.editor.children)
            }
          ).then(res => {
            if (res.data.code === 138) {
              this.$tip({
                content: "更新成功",
                type: "success",
                duration: 1000,
              })
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
            "/bbs/draft/",
            {
              title: this.title,
              category_id: this.category,
              raw_content: JSON.stringify(this.$refs.editor.editor.children)
            }
          ).then(res => {
            if (res.data.code === 137) {
              this.draft_id = res.data.result.id
              this.$tip({
                content: "保存成功",
                type: "success",
                duration: 1000,
              })
            } else {
              this.$tip({
                content: res.data.msg,
                type: "warning",
                duration: 1000,
              })
            }
          })
        }
        this.clear_draft()
      },
      load_drafts() {
        this.$request.api.get(
          this.next || "/bbs/draft/",
        ).then(res => {
          if (res.data.code === 136) {
            for (let i of res.data.result.results) {
              this.draft_list.push(i)
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
      post_article() {
        if (!this.is_valid()) return

        let editor = this.$refs.editor.editor
        let request
        if (this.update_id === undefined) {
          request = this.$request.api.post(
            "/bbs/article/",
            {
              title: this.title,
              content: editor.getHtml(),
              raw_content: JSON.stringify(editor.children),
              category_id: this.category
            }
          )
        } else {
          request = this.$request.api.put(
            `/bbs/article/${this.update_id}/`,
            {
              title: this.title,
              content: editor.getHtml(),
              raw_content: JSON.stringify(editor.children),
            })
        }

        request.then(res => {
          if (res.data.code === 113 || res.data.code === 114) {
            this.$tip({
              content: "发布成功",
              type: "success",
              duration: 1000,
            })
            if (this.draft_id) {
              this.delete_draft(this.draft_id, false)
            }
            this.$router.replace(`/bbs/article/${res.data.result.id}`)
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
        }).catch(err => {
          this.$tip({
            content: err,
            type: "error",
            duration: 2000,
          })
        })
      },
      get_draft(id) {
        this.show = false
        this.clear_draft()
        this.$request.api.get(
          `/bbs/draft/${id}/`,
        ).then(res => {
          this.draft_id = res.data.result.id
          this.title = res.data.result.title
          this.category = res.data.result.category.id
          let editor = this.$refs.editor.editor
          SlateTransforms.insertNodes(editor, JSON.parse(res.data.result.raw_content))
          SlateTransforms.removeNodes(editor, {at: [0]})
        })
      },
      delete_draft(id, tip) {
        if (tip) {
          this.$dialog("是否删除草稿").then(res => {
            if (res !== "confirm") return;
            this.$request.api.delete(
              `/bbs/draft/${id}/`,
            ).then(res => {
              if (res.data.code === 139) {
                this.$tip({
                  content: "删除成功",
                  type: "success",
                  duration: 1000,
                })
                this.clear_draft()
                this.load_drafts()
              } else {
                this.$tip({
                  content: res.data.msg,
                  type: "warning",
                  duration: 1000,
                })
              }
            })
            if (id === this.draft_id) {
              this.draft_id = null
            }
          })
        } else {
          this.$request.api.delete(
            `/bbs/draft/${id}/`,
          ).then(res => {
            if (res.data.code === 139) {
              if (id === this.draft_id) {
                this.draft_id = null
              }
            }
          })
        }
      }
    },
    created() {
      this.$request.api.get('/bbs/category/?type=edit').then(res => {
        if (res.data.code === 180) {
          for (let i of res.data.result.results) {
            this.category_list.push(i)
          }
        } else {
          this.$tip({
            content: res.data.msg,
            type: "warning",
            duration: 1000,
          })
        }
      })

      if (this.$route.query.id) {
        this.$request.api.get(
          `bbs/article/${this.$route.query.id}/raw`
        ).then(res => {
          if (res.data.code === 111) {
            this.title = res.data.result.title
            this.category = res.data.result.category.id
            let editor = this.$refs.editor.editor
            SlateTransforms.insertNodes(editor, JSON.parse(res.data.result.raw_content))
            SlateTransforms.removeNodes(editor, {at: [0]})
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
        })
      } else {
        this.category = this.$route.query.category_id ? Number(this.$route.query.category_id) : 2
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

  .wrap {
    padding: 80px 0 0;
    margin-bottom: 56px;
    background-color: white;
  }

  .title {
    padding: 10px;
    --input-placeholder-size: 18px;
  }

  .category {
    position: fixed;
    left: 0;
    bottom: 0;
    background-color: #f6f6f6;
    width: 100%;
    padding: 10px;
  }

  .drafts {
    width: 90vw;
    height: 70vh;
    padding: 10px;
  }

  .draft {
    padding: 10px;
  }

  .draft-info {
    display: flex;
    justify-content: space-between;
  }

  .draft-title {
    line-height: 24px;
    font-size: 18px;
    font-weight: bolder;
  }

  .time {
    font-size: 14px;
    line-height: 20px;
    color: #666666;
  }
</style>
