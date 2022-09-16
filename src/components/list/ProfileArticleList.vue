<template>
  <div class="order" v-if="!author_id">
    <var-menu :offset-y="25" :offset-x="-10" v-model:show="show_order">
      <div class="order-text" @click="show_order = !show_order">{{order_text}}
        <var-icon style="margin: 5px 0" name="menu-down"/>
      </div>

      <template #menu>
        <div class="menu">
          <var-cell @click="change_order(order)" v-for="order in order_list">{{order.text}}
          </var-cell>
        </div>
      </template>
    </var-menu>
  </div>

  <var-list
    :finished="finished"
    v-model:loading="loading"
    @load="load"
    :offset="200"
    :immediate-check="false"
  >
    <div class="post-card" v-for="post in post_list">
      <Transition appear name="bloom">
        <article-card
          v-if="post.type==='article'"
          :article="post"
          :hide_author="true"
          @onClickImg="click_img"
        />
      </Transition>
      <Transition appear name="bloom">
        <column-card
          v-if="post.type==='column'"
          :column="post"
        />
      </Transition>
    </div>
  </var-list>
</template>

<script>
  import ArticleCard from "../card/ArticleCard";
  import _ from "lodash";
  import ColumnCard from "../card/ColumnCard";

  export default {
    name: "ProfileArticleList",
    components: {
      ColumnCard,
      ArticleCard
    },
    props: {
      author_id: null,
    },
    emits: [
      "onClickImg",
    ],
    data() {
      return {
        show_order: false,
        ordering: "-update_time",
        order_text: "最新回复",
        order_list: [
          {
            text: "最新回复",
            ordering: "-update_time",
          },
          {
            text: "最新发布",
            ordering: "-create_time",
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

        post_list: [],
        current: null,
        loading: true,
        finished: false,
      }
    },
    methods: {
      click_img(images) {
        this.$emit("onClickImg", images)
      },
      change_order(order) {
        this.ordering = order.ordering
        this.order_text = order.text
        this.show_order = false
        this.reload()
      },
      reload() {
        this.post_list = []
        this.finished = false
        this.loading = true
        this.current = null
        this.load()
      },
      load() {
        this.$request.api.get(
          this.author_id ? `/user/info/post/?offset=${this.current || 0}&user_id=${this.author_id}` : `/user/self/post/?offset=${this.current || 0}&order=${this.ordering}`,
        ).then(res => {
          if (res.data.code === 181) {
            let temp = []
            for (let i of res.data.result.content.article) {
              temp.push({
                type: "article",
                ...i
              })
            }
            for (let i of res.data.result.content.column) {
              temp.push({
                type: "column",
                ...i
              })
            }


            for (let i of _.sortBy(temp, x => {
              switch (this.ordering) {
                case "-update_time":
                  return -(new Date(x.update_time).getTime())
                case "-create_time":
                  return -(new Date(x.create_time).getTime())
                case "-up_num":
                  return -(x.up_num)
                case "-comment_num":
                  return -(x.comment_num)
              }
            })) {
              this.post_list.push(i)
            }
            this.current += 10
            this.loading = false
            this.finished = res.data.result.end
            this.refreshing = false
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
    created() {
      this.load()
    }
  }
</script>

<style scoped>
  .order {
    display: flex;
    justify-content: right;
    align-items: center;
    line-height: 30px;
  }

  .order-text {
    font-size: 14px;
    color: #666666;
  }

  .menu {
    background-color: white;
  }

  .post-card {
    margin: 10px;
  }
</style>
