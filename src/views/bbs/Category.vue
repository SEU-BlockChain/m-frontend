<template>
  <div class="animation-wrap">
    <var-app-bar
      class="app-bar"
      text-color="#333"
      :class="{
      'var-elevation--1':0.5<=scroll_percent&&scroll_percent<0.6,
      'var-elevation--2':0.6<=scroll_percent&&scroll_percent<0.7,
      'var-elevation--3':0.7<=scroll_percent&&scroll_percent<0.8,
      'var-elevation--4':0.8<=scroll_percent&&scroll_percent<0.9,
      'var-elevation--5':0.9<=scroll_percent,
    }"
      :style="{backgroundColor:`rgba(255,255,255,${scroll_percent})`} "
      color="transparent"
      :elevation="false"
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
    <div style="height: 54px;"/>

    <div class="head" v-if="category">
      <var-card class="card">
        <template #extra>
          <div class="content">
            <img class="icon var-elevation--5"
                 :src="this.$settings.cos_url+'bbs-category/'+category.icon_detail" alt="">
            <div class="category">
              <div class="category-title">{{category.category}}</div>
              <div class="category-desc break">{{category.description}}</div>
            </div>
          </div>
        </template>
      </var-card>
    </div>

    <var-pull-refresh v-model="refreshing" @refresh="refresh" success-duration="1000">
      <div class="body var-elevation--5">
        <div class="order">
          <div>筛选条件</div>
          <var-menu :offset-y="25" :offset-x="-10" v-model:show="show_order">
            <div @click="show_order = !show_order">{{order_text}}
              <var-icon name="menu-down"/>
            </div>
            <template #menu>
              <div class="menu">
                <var-cell @click="change_order(order)" v-for="order in order_list">{{order.text}}
                </var-cell>
              </div>
            </template>
          </var-menu>
        </div>

        <div class="article-container">
          <var-list
            :finished="finished"
            v-model:loading="loading"
            @load="load_article"
          >
            <div v-for="article in article_list">
              <div v-if="this.$store.state.remove.article.indexOf(article.id)===-1">
                <transition name="bloom" appear>
                  <article-card
                    :hide_category="true"
                    :key="article.id"
                    :article="article"
                    @onClickImg="click_img"
                  />
                </transition>
              </div>
            </div>
          </var-list>
        </div>
      </div>
    </var-pull-refresh>

    <var-button v-if="category_id!=='1'||this.$store.state.user?.is_staff" class="post-article" type="success" round
                @click="this.$router.push({path:'/bbs/post-article',query:{category_id:category_id}})">
      <var-icon size="28" name="plus"/>
    </var-button>
  </div>
</template>

<script>
  import ArticleCard from "components/card/ArticleCard";

  export default {
    name: "Category",
    components: {
      ArticleCard
    },
    data() {
      return {
        scroll_percent: 0,
        category: null,
        refreshing: false,
        category_id: this.$route.params.category_id,
        show_order: false,
        ordering: "-comment_time",
        order_text: "最新回复",
        order_list: [
          {
            text: "最新回复",
            ordering: "-comment_time",
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
        next: null,
        article_list: []
      }
    },
    methods: {
      click_img(images) {
        this.$store.commit("set_image_preview",images)
      },
      refresh() {
        this.article_list = []
        this.finished = false
        this.loading = true
        this.next = null
        this.load_article()
      },
      change_order(order) {
        this.ordering = order.ordering
        this.order_text = order.text
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
          this.next || `/bbs/article/?category_id=${this.category_id || ""}&ordering=${this.ordering}`,
        ).then(res => {
          if (res.data.code === 112) {
            for (let i of res.data.result.results) {
              this.article_list.push(i)
            }
            this.next = res.data.result.next
            this.loading = false
            this.finished = !Boolean(this.next)
            this.refreshing = false
          } else {
            this.refreshing = false
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
        this.loading = true
        this.next = null
      }
    },
    created() {
      this.$request.api.get(
        `/bbs/category/${this.$route.params.category_id}`
      ).then(res => {
        if (res.data.code === 179) {
          this.category = res.data.result
        } else {
          this.$tip({
            content: res.data.msg,
            type: "warning",
            duration: 1000,
          })
        }
      })
    },
    mounted() {
      let that = this
      document.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        that.scroll_percent = scrollTop / 100
      })
    }
  }
</script>

<style scoped>

  .post-article {
    position: fixed;
    right: 15px;
    bottom: 120px;
  }

  .body {
    min-height: 100vh;
    border-radius: 10px 10px 0 0;
    background-color: #fcfcfc;
  }

  .order {
    padding: 5px;
    font-size: 14px;
    color: #333333;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .menu {
    background-color: white;
  }

  .article-container {
    min-height: 100vh;
    background-color: #f0f1f5;
  }

  .content {
    padding: 10px;
    display: flex;
    justify-content: left;
  }

  .app-bar {
    width: 100vw;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1;
  }

  .title {
    text-align: center;
    font-weight: bolder;
  }

  .head {
    margin: 10px;
  }

  .icon {
    border-radius: 50%;
    height: 64px;
    margin: 0 10px;
  }

  .category {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    flex-grow: 1;
  }

  .category-title {
    font-family: "85W";
    font-size: 17px;
  }

  .category-desc {
    color: #888888;
    font-size: 13px;
  }
</style>
