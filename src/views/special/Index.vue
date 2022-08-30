<template>
  <div class="animation-wrap">
    <var-app-bar class="app-bar" color="white" title-position="center">
      <template #left>
        <var-button
          round
          text
          color="transparent"
          text-color="#fff"
          @click="this.$router.return('/community')"
        >
          <var-icon name="chevron-left" color="#888" :size="24"/>
        </var-button>
      </template>
      <template #default>
        <div class="title">专栏</div>
      </template>
      <template #right>
        <var-button
          round
          text
          color="transparent"
          text-color="#ffffff"
        >
          <var-icon color="#888" name="magnify-plus-outline" :size="24"/>
        </var-button>
      </template>
    </var-app-bar>

    <div style="height: 54px"/>
    <var-pull-refresh v-model="refreshing" @refresh="refresh" success-duration="1000">
      <var-swipe class="swipe" :autoplay="3000" v-if="banner_list.length">
        <var-swipe-item v-for="banner in banner_list" @click="this.$router.push(banner.url)">
          <img :src="this.$settings.cos_url+`static/${banner.img}`">
        </var-swipe-item>
      </var-swipe>

      <div class="column-container">
        <var-list
          :finished="finished"
          v-model:loading="loading"
          @load="load_column"
        >
          <div style="margin: 3px;" v-for="column in column_list">
            <transition name="bloom" appear>
              <column-card :column="column"/>
            </transition>
          </div>
        </var-list>
      </div>
    </var-pull-refresh>

    <var-button v-if="this.$store.state.user?.permission.indexOf('column_author')!==-1" color="#4ebaee"
                class="post-column" type="success" round
                @click="this.$router.push('/special/post-column')">
      <icon-edit size="32"/>
    </var-button>
  </div>
</template>

<script>
  import ColumnCard from "components/card/ColumnCard";

  export default {
    name: "Index",
    components: {
      ColumnCard,
    },
    data() {
      return {
        floating: false,
        finished: false,
        loading: false,
        column_list: [],
        refreshing: false,
        banner_list: []
      }
    },
    methods: {
      load_column() {
        this.$request.api.get(
          this.next || `/special/column/`,
        ).then(res => {
          if (res.data.code === 159) {
            for (let i of res.data.result.results) {
              this.column_list.push(i)
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
        this.column_list = []
        this.finished = false
        this.loading = true
        this.next = null
        this.load_column()
      }
    },
    created() {
      this.$request.api.get('/common/sticky/banner?category=1').then(res => {
        if (res.data.code === 177) {
          this.banner_list = res.data.result.banner
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
</script>

<style scoped>

  .app-bar {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 100;
  }

  .title {
    font-family: Number, "85W", sans-serif;
    width: 100%;
    font-size: 20px;
    color: #06f;
    text-align: center;
  }

  .swipe img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    pointer-events: none;
  }

  .post-column {
    position: fixed;
    right: 15px;
    bottom: 120px;
  }

  .column-container {
    min-height: 100vh;
  }
</style>
