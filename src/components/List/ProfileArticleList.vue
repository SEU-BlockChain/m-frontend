<template>
  <div class="order">
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
    <div v-for="article in article_list">
      <var-card class="card article-card" elevation="1">
        <template #extra>
          <article-card
            :key="article.id"
            :article="article"
            :hide_author="true"
            @onClickImg="click_img"
          />
        </template>
      </var-card>
    </div>
  </var-list>
</template>

<script>
  import ArticleCard from "../card/ArticleCard";

  export default {
    name: "ProfileArticleList",
    components: {
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

        article_list: [],
        next: null,
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
        this.article_list = []
        this.finished = false
        this.loading = true
        this.next = null
        this.load()
      },
      load() {
        this.$request.api.get(
          this.next || `/bbs/article/?ordering=${this.ordering}&author__id=${this.author_id}`,
        ).then(res => {
          if (res.data.code === 112) {
            for (let i of res.data.result.results) {
              this.article_list.push(i)
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

  .article-card {
    margin: 10px;
  }
</style>