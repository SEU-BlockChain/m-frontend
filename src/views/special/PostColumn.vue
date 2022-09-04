<template>
  <div class="animation-wrap">
    <var-app-bar
      class="app-bar"
      color="#f0f1f5"
      text-color="#333"
      title-position="center"
    >
      <template #left>
        <var-button
          round
          text
          color="transparent"
          text-color="#333"
          @click="this.$router.return('/column')"
        >
          <var-icon name="chevron-left" :size="24"/>
        </var-button>
      </template>
      <template #right>
        <var-button
          text outline
          size="small"
          type="primary"
          @click="show=true"
        >
          我的专栏
        </var-button>
      </template>
    </var-app-bar>

    <div class="wrap">
      <div class="space">
        <a-input
          class="title"
          placeholder="标题"
          v-model="title"
          :max-length="50"
          allow-clear
          show-word-limit
        />
      </div>

      <div class="space">
        <a-textarea
          class="description"
          placeholder="请输入简介"
          :auto-size="{minRows:2,maxRows:5}"
          :max-length="100"
          allow-clear
          show-word-limit
          v-model="description"
        />
      </div>

      <a-auto-complete
        allow-clear
        class="tags"
        style="background-color: white"
        :data="all_tag.map(x => x.name)"
        @search="search_tag"
        @select="select_tag"
        placeholder="选择标签"
      />

      <div class="space">
        <var-chip style="margin: 3px" size="small" v-for="i in tags" closable :round="false" @close="remove_tag(i)">
          {{i.name}}
        </var-chip>
      </div>

      <column-editor ref="editor" @onChange="update_menu"/>
    </div>

    <a-popover position="lb">
      <var-button class="menu" type="success" round>
        <var-icon size="28" name="format-list-checkbox"/>
      </var-button>
      <template #content>
        <div style="text-align: center">目录</div>
        <ul class="menu-container">
          <li v-for="i in menu" :type="i.type" @click="to_head(i.id)">{{i.text}}</li>
        </ul>
      </template>
    </a-popover>

    <div class="foot var-elevation--12">
      <var-button class="foot-btn" :disabled="!is_valid" type="info" size="small" @click="save">保存为草稿</var-button>
      <var-button class="foot-btn" :disabled="!is_valid" type="success" size="small" @click="submit">发布</var-button>
      <var-button v-if="id===undefined" class="foot-btn" type="warning" size="small" @click="clear">清空</var-button>
      <var-button v-else class="foot-btn" type="danger" size="small" @click="del">删除</var-button>

    </div>

    <var-popup style="border-radius: 5px" v-model:show="show" @close="clear_pop">
      <div class="pop-title">我的创作</div>
      <var-divider margin="0"/>
      <div class="column-list">
        <var-list
          :finished="finished"
          v-model:loading="loading"
          @load="load_column"
        >
          <div :key="item.id" v-for="item in column_list" @click="load(item.id)">
            <div class="between">
              <div class="vertical">
                <div>{{item.title}}</div>
                <div class="time">{{this.$calc.filters.date(item.update_time)}}</div>
              </div>

              <div v-if="item.is_draft&&!item.is_audit">
                <var-chip size="small" type="info">草稿</var-chip>
              </div>

              <div v-else-if="!item.is_draft&&!item.is_audit">
                <var-chip size="small" type="warning">审核中</var-chip>
              </div>

              <div v-else-if="item.is_draft&&item.is_audit">
                <var-chip size="small" type="danger">未通过</var-chip>
              </div>

              <div v-else-if="!item.is_draft&&item.is_audit">
                <var-chip size="small" type="success">已通过</var-chip>
              </div>

            </div>
            <var-divider/>
          </div>
        </var-list>
      </div>
    </var-popup>
  </div>
</template>

<script>
  import ColumnEditor from "components/input/ColumnEditor";
  import {SlateTransforms} from "@wangeditor/editor";

  export default {
    name: "PostColumn",
    components: {
      ColumnEditor
    },
    data() {
      return {
        all_tag: [],
        id: undefined,
        menu: [],
        title: "",
        description: "",
        tags: [],
        show: false,
        column_list: [],
        finished: false,
        loading: false,
        next: null,
      }
    },
    computed: {
      is_valid() {
        return this.title && this.tags.length && this.description
      }
    },
    methods: {
      del() {
        this.$dialog(
          "确认删除？"
        ).then(res => {
          if (res === "confirm") {
            this.$request.api.delete(
              `/special/self/${this.id}/`
            ).then(res => {
              if (res.data.code === 156) {
                this.$tip({
                  content: "已删除",
                  type: "success",
                  duration: 1000,
                })
                this.id = undefined
                this.title = ""
                this.description = ""
                this.tags = []
                this.$refs.editor.editor.clear()
              } else {
                this.$tip({
                  content: res.data.msg,
                  type: "warning",
                  duration: 1000,
                })
              }
            })

          }
        })
      },
      clear() {
        this.$dialog(
          "确认清空全部内容？"
        ).then(res => {
          if (res === "confirm") {
            this.title = ""
            this.description = ""
            this.tags = []
            this.$refs.editor.editor.clear()
          }
        })

      },
      search_tag(value) {
        this.$request.api.get(
          `/special/tag/?search=${value}`
        ).then(res => {
          if (res.data.code === 157) {
            if (res.data.result.length) {
              this.all_tag = res.data.result
            }
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
        })
      },
      select_tag(value) {
        if (this.tags.map(x => x.name).indexOf(value) !== -1) return
        for (let i of this.all_tag) {
          if (i.name === value) {
            this.tags.push(i)
          }
        }
      },
      remove_tag(i) {
        for (let j in this.tags) {
          if (this.tags[j].id === i.id) {
            this.tags.splice(j, 1)
          }
        }
      },
      clear_pop() {
        this.column_list = []
        this.finished = false
        this.loading = false
        this.next = null
      },
      load(id) {
        this.$request.api.get(
          `/special/self/${id}/`
        ).then(res => {
          if (res.data.code === 152) {
            this.id = res.data.result.id
            this.title = res.data.result.title
            this.description = res.data.result.description
            this.tags = res.data.result.tag
            let editor = this.$refs.editor.editor
            editor.clear()
            SlateTransforms.insertNodes(editor, JSON.parse(res.data.result.raw_content))
            SlateTransforms.removeNodes(editor, {at: [0]})
            this.show = false
            this.clear_pop()
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
        })
      },
      load_column() {
        this.$request.api.get(
          this.next || "/special/self/",
        ).then(res => {
          if (res.data.code === 153) {
            for (let i of res.data.result.results) {
              this.column_list.push(i)
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
      update_menu() {
        this.menu = this.$refs.editor.editor.getElemsByTypePrefix('header').map(x => {
          return {
            id: x.id,
            text: x.children[0].text,
            type: x.type
          }
        })
      },
      to_head(id) {
        this.$refs.editor.editor.scrollToElem(id)
      },
      save() {
        if (!this.title || !this.tags.length || !this.description || this.$refs.editor.editor.isEmpty()) return;
        if (this.id === undefined) {
          this.$request.api.post(
            "/special/self/",
            {
              title: this.title,
              description: this.description,
              is_draft: true,
              tag_list: this.tags,
              menu: JSON.stringify(this.menu),
              raw_content: JSON.stringify(this.$refs.editor.editor.children)
            }
          ).then(res => {
            if (res.data.code === 154) {
              this.$tip({
                content: "保存成功",
                type: "success",
                duration: 1000,
              })
              this.id = res.data.result.id
            } else {
              this.$tip({
                content: res.data.msg,
                type: "warning",
                duration: 1000,
              })
            }
          })
        } else {
          this.$request.api.put(
            `/special/self/${this.id}/`,
            {
              title: this.title,
              description: this.description,
              is_draft: true,
              tag_list: this.tags,
              menu: JSON.stringify(this.menu),
              raw_content: JSON.stringify(this.$refs.editor.editor.children)
            }
          ).then(res => {
            if (res.data.code === 155) {
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
      },
      submit() {
        if (!this.title || !this.tags.length || !this.description || this.$refs.editor.editor.isEmpty()) return;
        if (this.id === undefined) {
          this.$request.api.post(
            "/special/self/",
            {
              title: this.title,
              description: this.description,
              is_draft: false,
              tag_list: this.tags,
              menu: JSON.stringify(this.menu),
              content: this.$refs.editor.editor.getHtml(),
              raw_content: JSON.stringify(this.$refs.editor.editor.children)
            }
          ).then(res => {
            if (res.data.code === 154) {
              this.$tip({
                content: "操作成功，待审核后发布",
                type: "success",
                duration: 1000,
              })
              this.id = res.data.result.id
            } else {
              this.$tip({
                content: res.data.msg,
                type: "warning",
                duration: 1000,
              })
            }
          })
        } else {
          this.$request.api.put(
            `/special/self/${this.id}/`,
            {
              title: this.title,
              description: this.description,
              is_draft: false,
              tag_list: this.tags,
              menu: JSON.stringify(this.menu),
              content: this.$refs.editor.editor.getHtml(),
              raw_content: JSON.stringify(this.$refs.editor.editor.children)
            }
          ).then(res => {
            if (res.data.code === 155) {
              this.$tip({
                content: "操作成功，待审核后发布",
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
      }
    }
  }
</script>

<style scoped>
  .wrap {
    padding-top: 54px;
    min-height: 100vh;
    z-index: 100;
  }

  .app-bar {
    width: 100vw;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
  }

  .title {
    background-color: white;
    border-radius: 5px;
  }

  .description {
    background-color: white;
    border-radius: 5px;
  }

  .tags {
    background-color: white;
    margin-bottom: 3px;
    border-radius: 5px;
  }

  .menu {
    position: fixed;
    right: 15px;
    bottom: 120px;
  }

  .space {
    padding: 3px;
    background-color: #f0f1f5;
  }

  .foot {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #f0f1f5;
    padding: 5px;
    display: flex;
    justify-content: flex-end;
  }

  .foot-btn {
    margin: 3px;
  }


  .menu-container {
    list-style-type: none;
    padding-left: 20px;
  }

  .menu-container li {
    color: #333;
    margin: 10px 0;
    cursor: pointer;
  }

  .menu-container li:hover {
    text-decoration: underline;
  }

  .menu-container li[type="header1"] {
    font-size: 20px;
    font-weight: bold;
  }

  .menu-container li[type="header2"] {
    font-size: 16px;
    padding-left: 15px;
    font-weight: bold;
  }

  .menu-container li[type="header3"] {
    font-size: 14px;
    padding-left: 30px;
  }

  .menu-container li[type="header4"] {
    font-size: 12px;
    padding-left: 45px;
  }

  .menu-container li[type="header5"] {
    font-size: 12px;
    padding-left: 60px;
  }

  .column-list {
    width: 80vw;
    max-height: 70vh;
    overflow-y: scroll;
    padding: 5px;
  }

  .pop-title {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    margin: 10px 0;
  }

  .between {
    padding: 0 3px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .vertical {
    width: 70%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .time {
    font-size: 12px;
    margin-top: 10px;
    color: #888;
  }
</style>
