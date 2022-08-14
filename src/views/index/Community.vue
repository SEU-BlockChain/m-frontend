<template>
  <div class="animation-wrap">
    <var-pull-refresh v-model="refreshing" @refresh="reload">

      <div class="top">
        <div class="find">
          <var-input class="search-input" placeholder="搜索" :hint="false" :line="false" v-model="search">
            <template #prepend-icon>
              <var-icon name="magnify-plus-outline"/>
            </template>
          </var-input>
        </div>
        <div class="options">
          <div class="option" @click="this.$router.push('/special')">
            <img class="option-icon" src="~assets/img/column.svg" alt="">
            <div class="option-text">专栏</div>
          </div>
          <div class="option" @click="this.$router.push('/information')">
            <img class="option-icon" src="~assets/img/news.svg" alt="">
            <div class="option-text">资讯</div>
          </div>
          <div class="option">
            <img class="option-icon" src="~assets/img/ask.svg" alt="">
            <div class="option-text">问答</div>
          </div>
        </div>

        <div class="bbs">
          <var-card class="card" @click="this.$router.push('/bbs')">
            <template #extra>
              <div class="card-wrap">
                <img class="card-icon" src="~assets/img/bbs.svg" alt="">
                <div>
                  <div class="card-text">讨论区</div>
                  <div class="card-desc">区块链交流·见解分享</div>
                </div>
                <div class="card-enter">
                  进入讨论区>
                </div>
              </div>
            </template>
          </var-card>
        </div>
      </div>

      <div class="body">
        <div class="notice">
          <var-icon name="file-document-outline"/>
          官方公告
        </div>
        <var-divider margin="0"/>

        <div class="recommend">
          推荐
        </div>
        <var-list
          :finished="finished"
          v-model:loading="loading"
          @load="load"
          :immediate-check="false"
        >
          <div v-for="post in post_list">
            <transition name="bloom" appear>
              <div v-if="post.type==='article'">
                <article-card :article="post" @onClickImg="click_img"/>
              </div>
              <div v-else-if="post.type==='column'">
                <column-card :column="post"/>
              </div>
              <div v-else-if="post.type==='news'">
                <var-card
                  @click="this.$router.push(`/information/news/${post.id}`)"
                  elevation="0"
                  class="card"
                  :title="post.title"
                  :description="post.description">
                  <template #extra>
                    <div class="time">
                      {{this.$calc.filters.date(post.create_time)}}
                    </div>
                  </template>
                </var-card>
              </div>
            </transition>
            <var-divider margin="0"/>
          </div>
        </var-list>

        <div style="height: 30vh"></div>

      </div>
    </var-pull-refresh>

    <var-image-preview style="transition-duration: 0.5s" closeable :images="images" v-model:show="show_img"/>
  </div>
</template>

<script>
  import ArticleCard from "../../components/card/ArticleCard";
  import ColumnCard from "../../components/card/ColumnCard";
  import _ from "lodash"

  export default {
    name: "Community",
    components: {ColumnCard, ArticleCard},
    emits: ["active"],
    data() {
      return {
        search: "",
        finished: false,
        loading: false,
        current: 0,
        post_list: [],
        images: [],
        show_img: false,
        refreshing: false
      }
    },
    methods: {
      click_img(images) {
        this.images = images
        this.show_img = true
      },
      reload() {
        this.current = 0
        this.finished = false
        this.post_list = []
        this.load()
      },
      load() {
        this.$request.api.get(
          `/common/recommend/community?offset=${this.current}`,
        ).then(res => {
          if (res.data.code === 168) {
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
            for (let i of res.data.result.content.news) {
              temp.push({
                type: "news",
                ...i
              })
            }
            for (let i of _.sortBy(temp, x => -(new Date(x.update_time).getTime()))) {
              this.post_list.push(i)
            }
            this.current += 10
            this.loading = false
            this.finished = res.data.result.end
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
      }
    },
    created() {
      this.$emit("active", 1)
      this.load()
    },
    activated() {
      this.$emit("active", 1)
    }
  }
</script>

<style scoped>
  .find {
    width: 100vw;
    padding: 20px 10px;
  }

  .search-input {
    background-color: white;
    padding: 0 10px;
    border-radius: 15px;
  }

  .options {
    display: flex;
    width: 100vw;
    justify-content: left;

  }

  .option {
    width: 16%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .option-icon {
    width: 35px;
    height: 35px;
  }

  .option-text {
    font-size: 13px;
  }

  .bbs {
    padding: 10px;
    width: 100vw;
  }

  .body {
    background-color: white;
    min-height: 100vh;
    border-radius: 10px 10px 0 0;
  }

  .notice {
    padding: 10px 15px;
    font-size: 14px;
    font-weight: bold;
    line-height: 18px;
    color: #333;
  }

  .recommend {
    padding: 10px 15px;
    font-size: 14px;
    font-weight: bold;
    line-height: 18px;
    color: #333;
  }

  .card-wrap {
    padding: 10px 15px;
    display: flex;
    justify-content: flex-start;
  }

  .card-icon {
    width: 50px;
    margin-right: 5px;
  }

  .card-text {
    font-weight: bolder;
    line-height: 30px;
  }

  .card-desc {
    line-height: 20px;
    font-size: 12px;
    color: #999;
  }

  .card-enter {
    flex-grow: 1;
    line-height: 50px;
    font-size: 14px;
    text-align: right;
  }

  .time {
    display: flex;
    justify-content: flex-end;
    margin: 3px 10px;
    font-size: 12px;
    color: #888;
  }
</style>