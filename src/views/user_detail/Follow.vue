<template>
  <div class="animation-wrap">
    <var-app-bar class="app-bar var-elevation--2" color="white" :elevation="false" text-color="#333" title="我的好友">
      <template #left>
        <var-button
          round
          text
          color="transparent"
          text-color="#333"
          @click="this.$router.return('/user')"
        >
          <var-icon name="chevron-left" :size="24"/>
        </var-button>
      </template>
    </var-app-bar>

    <var-tabs class="bar" v-model:active="active">
      <var-tab style="width: 30%;margin: 0 10%" @click="toggle(0)">我关注的</var-tab>
      <var-tab style="width: 30%;margin: 0 10%" @click="toggle(1)">我的粉丝</var-tab>
    </var-tabs>
    <div style="height: 98px"/>
    <div class="search">
      <var-input class="search-input" placeholder="搜索" :hint="false" :line="false" v-model="search" @input="filter">
        <template #prepend-icon>
          <var-icon @click="filter" name="magnify-plus-outline"/>
        </template>
      </var-input>
    </div>
    <div class="total">
      共{{total}}人
    </div>
    <div class="back">
      <var-list
        :finished="finished"
        v-model:loading="loading"
        @load="load"
      >
        <div :key="item" v-for="item in list">
          <simple-user-card :user="item"/>
        </div>
      </var-list>
    </div>
  </div>
</template>

<script>
  import SimpleUserCard from "components/card/SimpleUserCard";

  export default {
    name: "Follow",
    components: {
      SimpleUserCard
    },
    data() {
      return {
        active: 0,
        search: "",
        finished: false,
        loading: false,
        next: null,
        list: [],
        total: 0
      }
    },
    methods: {
      toggle(to) {
        if (to === this.active) return
        this.active = to
        this.$router.replace({path: "/user/follow", query: {type: to ? "as_followed" : "as_follower"}})
        this.list = []
        this.finished = false
        this.loading = true
        this.load()
      },
      filter() {
        this.list = []
        this.finished = false
        this.load()
      },
      load() {
        let url = `/user/follow/${this.$store.state.user.id}/${this.active ? "as_followed" : "as_follower"}/?name=${this.search}`
        this.$request.api.get(
          this.next || url
        ).then(res => {
          if (res.data.code === 131 || res.data.code === 130) {
            this.total = res.data.result["count"]
            for (let i of res.data.result.results) {
              if (res.data.code === 131) {
                this.list.push({
                  ...i.followed,
                  create_time: i.create_time
                })
              } else {
                this.list.push({
                  ...i.follower,
                  create_time: i.create_time
                })
              }
            }
            this.next = res.data.result.next
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
          this.loading = false
          this.finished = !Boolean(this.next)
        })
      }
    },
    created() {
      if (this.$route.query.type === "as_followed") {
        this.active = 1
      }
    }
  }
</script>

<style scoped>
  .app-bar {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    z-index: 20;
  }

  .bar {
    position: fixed;
    left: 0;
    top: 54px;
    width: 100vw;
    background-color: white;
    z-index: 10;
    border-bottom: 1px solid #ddd;
  }

  .search {
    padding: 8px 10px;
    background-color: white;
    border-bottom: 1px solid #eee;
  }

  .total {
    padding: 3px 10px;
    background-color: white;
    font-size: 12px;
  }

  .search-input {
    background-color: #f6f6f6;
    padding: 0 10px;
    border-radius: 15px;
  }

  .back {
    background-color: white;
    min-height: calc(100vh - 98px);
  }

</style>