<template>
  <div class="animation-wrap">
    <div class="content">
      <div class="search">
        <var-input
          clearable
          class="search-input"
          placeholder="搜索"
          :hint="false"
          :line="false"
          v-model="search"
          @change="filter"
          @clear="filter"
        >
          <template #prepend-icon>
            <var-icon @click="filter" name="magnify-plus-outline"/>
          </template>
        </var-input>
      </div>
      <var-pull-refresh v-model="refreshing" @refresh="refresh" success-duration="1000">
        <div class="author">
          <div class="follow-text">
            <div class="tip">
              我的关注
            </div>
            <div class="more" @click="this.$router.push({path:'/user/follow',query:{type:'as_follower'}})">
              查看全部>
            </div>
          </div>
          <div class="followed">
            <div class="info" v-for="followed in follower_list">
              <img class="avatar" :src="this.$settings.cos_url+followed.followed.icon"
                   @click="this.$router.push(`/user/${followed.followed.id}`)"/>
              <div class="username break">{{followed.followed.username}}</div>
            </div>
          </div>
        </div>
        <var-list
          style="min-height: 100vh"
          :finished="finished"
          v-model:loading="loading"
          @load="load"
          :immediate-check="false"
        >
          <div v-for="dynamic in dynamic_list">
            <div v-if="dynamic.origin===0">
              <transition name="slide-fade2" appear>
                <article-card
                  style="width: 100%;"
                  :article="dynamic.content"
                  :use_create_time="true"
                  @onClickImg="click_img"
                />
              </transition>
            </div>

            <div v-if="dynamic.origin===2">
              <transition name="slide-fade2" appear>
                <column-card style="margin-bottom: 5px" :column="dynamic.content"/>
              </transition>
            </div>
          </div>
        </var-list>
      </var-pull-refresh>
    </div>
  </div>
</template>

<script>
  import ArticleCard from "../../components/card/ArticleCard";
  import ColumnCard from "../../components/card/ColumnCard";

  export default {
    name: "Dynamic",
    components: {ColumnCard, ArticleCard},
    emits: ["active"],
    data() {
      return {
        dynamic_list: [],
        follower_list: [],
        next: null,
        loading: true,
        finished: false,
        search: "",
        refreshing: false,
      }
    },
    methods: {
      click_img(images) {
        this.$store.commit("set_image_preview",images)
      },
      refresh() {
        this.dynamic_list = []
        this.finished = false
        this.loading = true
        this.next = null
        this.load()
      },
      filter() {
        this.dynamic_list = []
        this.finished = false
        this.loading = true
        this.load()
      },
      load() {
        this.$request.api.get(
          this.next || `/message/dynamic?search=${this.search}`
        ).then(res => {
          if (res.data.code === 140) {
            for (let i of res.data.result.results) {
              this.dynamic_list.push(i)
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
      }
    },
    created() {
      this.$emit("active", 2)
      this.load()
      this.$request.api.get(
        `/user/follow/${this.$store.state.user.id}/as_follower`
      ).then(res => {
        if (res.data.code === 131) {
          this.total = res.data.result["count"]
          for (let i of res.data.result.results) {
            this.follower_list.push(i)
          }
        }
      })
      if (this.$store.state.message) {
        this.$store.state.message.dynamic = 0
      } else {
        this.$request.api.get(
          "user/self/message/"
        ).then(res => {
          this.$store.commit("message", res.data.result)
        })
      }
    },
    activated() {
      this.$emit("active", 2)
    }
  }
</script>

<style scoped>
  .content {
    padding-bottom: 60px;
    width: 100vw;
  }

  .author {
    background-color: white;
    margin-bottom: 10px;
    padding: 10px;
  }

  .follow-text {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .search {
    display: flex;
    justify-content: space-between;
    padding: 8px 10px;
    background-color: white;
    border-bottom: 1px solid #eee;
  }

  .search-input {
    background-color: #f6f6f6;
    padding: 0 10px;
    border-radius: 15px;
  }

  .tip {
    font-weight: bolder;
    font-size: 14px;
  }

  .more {
    font-size: 14px;
    color: #999999;
  }

  .followed {
    width: 100%;
    display: flex;
    justify-content: left;
    align-items: flex-start;
  }

  .info {
    margin: 10px 10px 0 0;
    width: 50px;
  }

  .avatar {
    width: 50px;
    border-radius: 50%;
  }

  .username {
    text-align: center;
    font-size: 12px;
  }
</style>
