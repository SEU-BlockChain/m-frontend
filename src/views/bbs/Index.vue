<template>
  <div class="head">
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
          @click="this.$router.return('/community')"
        >
          <var-icon name="chevron-left" :size="24"/>
        </var-button>
      </template>
      <template #default>
        <div class="title">讨论区</div>
      </template>
      <template #right>
        <var-button
          round
          text
          color="transparent"
          text-color="#333"
          @click="this.$router.return('/community')"
        >
          <var-icon name="magnify-plus-outline" :size="24"/>
        </var-button>
      </template>
    </var-app-bar>
    <var-tabs
      color="#f0f1f5"
      active-color="#4ebaee"
      inactive-color="#777"
      v-model:active="category_id"
      @change="reload"
    >
      <var-tab>全部</var-tab>
      <var-tab>官方公告</var-tab>
      <var-tab>杂谈</var-tab>
    </var-tabs>
    <var-divider margin="0"/>
  </div>

  <div class="body">
    <div class="order">
      <div>筛选条件</div>
      <var-menu :offset-y="25" :offset-x="-10" v-model:show="show_order">
        <div @click="show_order = !show_order">{{order_list[order_num].text}}
          <var-icon name="menu-down"/>
        </div>
        <template #menu>
          <div class="menu">
            <var-cell @click="change_order(0)">最新回复</var-cell>
            <var-cell @click="change_order(1)">最新发布</var-cell>
            <var-cell @click="change_order(2)">最多点赞</var-cell>
            <var-cell @click="change_order(3)">最多评论</var-cell>
          </div>
        </template>
      </var-menu>
    </div>

    <div class="top">
      <div class="top-item">
        <var-chip class="top-chip" type="info" size="small" :round="false">置顶</var-chip>
        <div class="top-text">123</div>
      </div>
      <div class="top-item">
        <var-chip class="top-chip" type="info" size="small" :round="false">置顶</var-chip>
        <div class="top-text">456</div>
      </div>
    </div>
    <var-divider margin="0"/>

    <div class="article-container">
      <var-list
        :finished="finished"
        v-model:loading="loading"
        @load="load_article"
      >
        <article-card :key="article.id" :article="article" v-for="article in article_list"
                      @change_category="change_category"/>
      </var-list>
    </div>
  </div>

  <var-button class="post-article" type="success" round @click="this.$router.push('/bbs/post-article')">
    <var-icon size="28" name="plus"/>
  </var-button>
</template>

<script>
  import ArticleCard from "components/card/ArticleCard";

  export default {
    name: "index",
    components: {
      ArticleCard
    },
    data() {
      return {
        category_id: 0,
        show_order: false,
        order_num: 0,
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
        top: [],
        finished: false,
        loading: false,
        article_list: []
      }
    },
    methods: {
      change_category(id) {
        this.category_id = id
        this.reload()
      },
      change_order(num) {
        this.order_num = num
        this.show_order = false
        this.reload()
      },
      reload() {
        this.clear()
        this.$settings.scrollAnimation(0)
        this.load_article()
      },
      load_article() {
        this.$request.api.get(
          this.next || `/bbs/article/?category_id=${this.category_id || ""}&ordering=${this.order_list[this.order_num].ordering}`,
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
      },
      clear() {
        this.article_list = []
        this.finished = false
        this.loading = false
      }
    },
    mounted() {
      let _this = this
      document.addEventListener("scroll", () => {
        _this.show_order = false
      })
    }
  }
</script>

<style scoped>
  .app-bar {
    width: 100vw;
  }

  .title {
    text-align: center;
    font-weight: bolder;
  }

  .head {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    z-index: 100;
  }

  .body {
    min-height: 100vh;
    padding-top: 98px;
    background-color: #fcfcfc;
  }

  .order {
    padding: 10px;
    font-size: 14px;
    color: #333333;
    display: flex;
    justify-content: space-between;
  }

  .top {
    padding: 10px;
    z-index: 10;
  }

  .top-item {
    margin: 10px 0;
    display: flex;
    justify-content: left;
  }

  .top-chip {
    margin: 0 10px;
  }

  .top-text {
    line-height: 24px;
    font-size: 16px;
  }

  .menu {
    background-color: white;
  }

  .article-container {
    min-height: 100vh;
    background-color: #f0f1f5;
  }

  .post-article {
    position: fixed;
    right: 15px;
    bottom: 120px;
  }
</style>