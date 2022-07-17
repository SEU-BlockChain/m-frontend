<template>
  <div class="animation-wrap">
    <var-app-bar
      class="app-bar"
      color="white"
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
      <template #default>
        <div class="bar-text">
          资讯
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
    <div style="height: 54px;"/>
    <Transition name="slide-fade">
      <div class="content" v-if="news_ready">
        <div class="title">{{news.title}}</div>
        <div class="time">
          <span>文章发表:{{this.$calc.filters.date(news.create_time)}}</span>
          <span v-if="delta>60">
            <span style="font-weight: lighter">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            <span>最后更新:{{this.$calc.filters.date(news.update_time)}}</span>
          </span>
        </div>

        <div class=" w-container" v-html="this.$xss(news.content)"></div>
      </div>
    </Transition>
  </div>
</template>

<script>
  export default {
    name: "News",
    data() {
      return {
        news: null,
        news_ready: false
      }
    },
    computed: {
      delta() {
        return (new Date(this.news.update_time).getTime()) - (new Date(this.news.create_time).getTime())
      }
    },
    created() {
      this.$request.api.get(
        `/information/news/${this.$route.params.id}/`,
      ).then(res => {
        if (res.data.code === 161) {
          this.news = res.data.result
          this.news_ready = true
        } else {
          this.$tip({
            content: res.data.msg,
            type: "warning",
            duration: 1000
          })
        }
      })
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

  .bar-text {
    font-family: Number, "85W", sans-serif;
    font-size: 18px;
    color: #111;
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

  .content {
    padding: 10px 10px 50px;
    background-color: #fafafa;
    border-radius: 0 0 10px 10px;
  }

</style>