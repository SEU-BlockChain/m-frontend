<template>
  <div class="animation-wrap">
    <var-app-bar
      class="app-bar"
      color="white"
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
          @click="this.$router.return('/information')"
        >
          <var-icon name="chevron-left" :size="24"/>
        </var-button>
      </template>
      <template #right>
        <var-button
          text
          text-color="#333"
          @click="show=true"
        >
          全部
        </var-button>
        <var-button
          text outline
          size="small"
          type="primary"
          @click="save(true)"
          :disabled="!is_valid"
        >
          保存为草稿
        </var-button>
        <div style="width: 10px"/>
        <var-button
          size="small"
          type="success"
          @click="save(false)"
          :disabled="!is_valid"
        >
          发布
        </var-button>
      </template>
    </var-app-bar>

    <div style="height: 54px;"/>

    <div class="space">
      <a-input
        class="title"
        placeholder="标题"
        v-model="title"
        :max-length="20"
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

    <column-editor ref="editor"/>

    <var-popup style="border-radius: 5px" v-model:show="show" @close="clear">
      <div class="pop-title">我发布的</div>
      <var-divider margin="0"/>
      <div class="news-list">
        <var-list
          :finished="finished"
          v-model:loading="loading"
          @load="load_all"
        >
          <div :key="item.id" v-for="item in news_list" @click="load(item.id)">
            <div class="between">
              <div class="vertical">
                <div>{{item.title}}</div>
                <div class="time">{{this.$calc.filters.date(item.update_time)}}</div>
              </div>

              <var-space>
                <div v-if="item.is_draft">
                  <var-chip size="small" type="info">草稿</var-chip>

                </div>

                <div v-else>
                  <var-chip size="small" type="success">已发布</var-chip>
                </div>
                <var-button
                  text outline
                  size="small"
                  type="danger"
                  @click.stop="delete_news(item.id)"
                >删除
                </var-button>
              </var-space>
            </div>
            <var-divider/>
          </div>
        </var-list>
      </div>
    </var-popup>

  </div>
</template>

<script>
  import ColumnEditor from "../../components/input/ColumnEditor";
  import {SlateTransforms} from "@wangeditor/editor";

  export default {
    name: "PostNews",
    components: {ColumnEditor},
    data() {
      return {
        show: false,
        title: "",
        description: "",
        id: undefined,
        finished: false,
        loading: false,
        news_list: []
      }
    },
    computed: {
      is_valid() {
        return this.title && this.description
      }
    },
    methods: {
      delete_news(id) {
        this.$dialog("是否删除").then(res => {
          if (res !== "confirm") return;
          this.$request.api.delete(
            `/information/news/${id}/`,
          ).then(res => {
            if (res.data.code === 165) {
              this.$tip({
                content: "删除成功",
                type: "success",
                duration: 1000,
              })
              this.clear()
              this.load_all()
            } else {
              this.$tip({
                content: res.data.msg,
                type: "warning",
                duration: 1000,
              })
            }
          })
          if (id === this.id) {
            this.id = undefined
          }
        })

      },
      clear() {
        this.news_list = []
        this.finished = false
        this.loading = false
        this.next = null
      },
      load(id) {
        this.$request.api.get(
          `/information/news/${id}/?raw=true`
        ).then(res => {
          if (res.data.code === 161) {
            this.id = res.data.result.id
            this.title = res.data.result.title
            this.description = res.data.result.description
            let editor = this.$refs.editor.editor
            editor.clear()
            SlateTransforms.insertNodes(editor, JSON.parse(res.data.result.raw_content))
            SlateTransforms.removeNodes(editor, {at: [0]})
            this.show = false
            this.clear()
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
        })
      },
      load_all() {
        this.$request.api.get(
          this.next || "/information/news/?self=true",
        ).then(res => {
          if (res.data.code === 162) {
            for (let i of res.data.result.results) {
              this.news_list.push(i)
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
      save(is_draft) {
        if (!this.title || !this.description || this.$refs.editor.editor.isEmpty()) return;
        if (this.id === undefined) {
          this.$request.api.post(
            "/information/news/",
            {
              title: this.title,
              description: this.description,
              is_draft: is_draft,
              content: this.$refs.editor.editor.getHtml(),
              raw_content: JSON.stringify(this.$refs.editor.editor.children)
            }
          ).then(res => {
            if (res.data.code === 163) {
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
          console.log(is_draft);
          this.$request.api.put(
            `/information/news/${this.id}/`,
            {
              title: this.title,
              description: this.description,
              is_draft: is_draft,
              content: this.$refs.editor.editor.getHtml(),
              raw_content: JSON.stringify(this.$refs.editor.editor.children)
            }
          ).then(res => {
            if (res.data.code === 164) {
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
      }
    }
  }
</script>

<style scoped>
  .between {
    padding: 0 3px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .vertical {
    width: 60%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .time {
    font-size: 12px;
    margin-top: 10px;
    color: #888;
  }

  .news-list {
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

  .app-bar {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    z-index: 20;
  }

  .title {
    background-color: white;
    border-radius: 5px;
  }

  .description {
    background-color: white;
    border-radius: 5px;
  }

  .space {
    padding: 3px;
  }
</style>