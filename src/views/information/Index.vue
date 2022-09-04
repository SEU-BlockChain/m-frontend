<template>
  <div class="animation-wrap">
    <var-app-bar
      class="app-bar"
      color="white"
      text-color="#333"
      title-position="left"
    >
      <template #left>
        <var-button
          round
          text
          color="transparent"
          text-color="#333"
          @click="this.$router.return('/community')"
        >
          <var-icon name="chevron-left" :size="30"/>
        </var-button>
      </template>
      <template #default>
        <div class="head-text">资讯</div>
      </template>
    </var-app-bar>

    <div style="height: 54px;"/>
    <var-pull-refresh v-model="refreshing" @refresh="refresh" success-duration="1000">
      <div class="news-container">
        <var-list
          :finished="finished"
          v-model:loading="loading"
          @load="load"
        >
          <div v-for="news in news_list">
            <transition name="bloom" appear>
              <var-card
                @click="this.$router.push(`/information/news/${news.id}`)"
                elevation="0"
                class="card"
                :title="news.title"
                :description="news.description">
                <template #extra>
                  <div class="time">
                    {{this.$calc.filters.date(news.create_time)}}
                  </div>
                </template>
              </var-card>
            </transition>
          </div>
        </var-list>
      </div>
    </var-pull-refresh>
    <var-button v-if="this.$store.state.user?.permission.indexOf('news_author')!==-1" color="#06f"
                class="post-news" type="success" round
                @click="this.$router.push('/information/post-news')">
      <icon-edit size="32"/>
    </var-button>
  </div>
</template>

<script>
  export default {
    name: "IndexInformation",
    data() {
      return {
        refreshing: false,
        news_list: [],
        finished: false,
        loading: false,
        next: null
      }
    },
    methods: {
      load() {
        this.$request.api.get(
          this.next || `/information/news/`,
        ).then(res => {
          if (res.data.code === 162) {
            for (let i of res.data.result.results) {
              this.news_list.push(i)
            }
            this.next = res.data.result.next
            this.loading = false
            this.finished = !Boolean(this.next)
            this.refreshing = false
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
        })
      },
      refresh() {
        this.news_list = []
        this.finished = false
        this.loading = true
        this.next = null
        this.load()
      }
    }
  }
</script>

<style scoped>
  .app-bar {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 100;
  }

  .head-text {
    font-family: Number, "85W", sans-serif;
    width: 100%;
    font-size: 18px;
    color: #06f;
    text-align: center;
  }

  .post-news {
    position: fixed;
    right: 15px;
    bottom: 120px;
  }

  .news-container {
    min-height: 100vh;
  }

  .card {
    --card-border-radius: 0;
    --card-description-margin: 10px 0 0 0;
    --card-title-font-size: 17px;
    border-bottom: 1px solid #ccc;
  }

  .time {
    display: flex;
    justify-content: flex-end;
    margin: 3px 10px;
    font-size: 12px;
    color: #888;
  }
</style>
