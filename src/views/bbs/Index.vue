<template>
  <div class="animation-wrap">
    <div class="background"/>
    <var-app-bar
      class="app-bar"
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
          text-color="#fff"
          :style="{color: `rgb(${255*(1-scroll_percent)},${255*(1-scroll_percent)},${255*(1-scroll_percent)})`}"
          @click="this.$router.return('/community')"
        >
          <var-icon name="chevron-left" :size="24"/>
        </var-button>
      </template>
      <template #default>
        <div
          class="title"
          :style="{color: `rgb(${255*(1-scroll_percent)},${255*(1-scroll_percent)},${255*(1-scroll_percent)})`}"
        >讨论区
        </div>
      </template>
      <template #right>
        <var-button
          round
          text
          color="transparent"
          text-color="#fff"
          :style="{color: `rgb(${255*(1-scroll_percent)},${255*(1-scroll_percent)},${255*(1-scroll_percent)})`}"
          @click="this.$router.return('/community')"
        >
          <var-icon name="magnify-plus-outline" :size="24"/>
        </var-button>
      </template>
    </var-app-bar>
    <div style="height: 54px;"/>
    <div class="category-wrap" v-if="category_list.length">
      <div class="category" v-for="category in category_list"
           @click="this.$router.push(`/bbs/category/${category.id}`)">
        <img class="category-icon" :src="this.$settings.cos_url+'bbs-category/'+category.icon" alt="">
        <div class="category-text">{{category.category}}</div>
      </div>
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
            <div v-for="article in article_list">
              <div v-if="this.$store.state.remove.article.indexOf(article.id)===-1">
                <transition name="bloom" appear>
                  <article-card
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

    <var-button class="post-article" type="success" round @click="this.$router.push('/bbs/post-article')">
      <var-icon size="28" name="plus"/>
    </var-button>

  </div>
</template>

<script>
  import ArticleCard from "components/card/ArticleCard";

  export default {
    name: "IndexBBS",
    components: {
      ArticleCard
    },
    data() {
      return {
        scroll_percent: 0,
        refreshing: false,
        category_id: 0,
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
        article_list: [],
        category_list: []
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
      this.$request.api.get('/bbs/category/').then(res => {
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
    },
    mounted() {
      let that = this
      document.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        that.scroll_percent = scrollTop / 130
      })

    }
  }
</script>

<style scoped>
  .animation-wrap {
    background: transparent;
  }

  .background {
    background-image: url("https://bc-1304907527.cos.ap-nanjing.myqcloud.com/articles/5579e3f3aab74a73b1a175ab4ccc06be.jpg");
    position: fixed;
    filter: brightness(0.8);
    left: 0;
    top: 0;
    height: 134px;
    width: 100%;
    z-index: -1;
    background-size: auto 100%;
    background-position: 50% 50%;
    background-repeat: no-repeat;
  }

  .category-wrap {
    display: flex;
    justify-content: flex-start;
    overflow-x: scroll;
    padding-bottom: 16px;
  }

  .category-wrap::-webkit-scrollbar {
    display: none
  }

  .category {
    margin: 0 8px;
    flex: 0 0 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .category-icon {
    width: 40px;
    height: 40px;
  }

  .category-text {
    font-size: 14px;
    color: whitesmoke;
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

  .top {
    padding: 2px 5px;
    z-index: 10;
  }

  .top-item {
    margin: 8px 0;
    display: flex;
    justify-content: left;
  }

  .top-chip {
    margin: 0 8px;
  }

  .top-text {
    line-height: 24px;
    font-size: 14px;
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
