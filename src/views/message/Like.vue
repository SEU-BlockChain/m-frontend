<template>
  <div class="animation-wrap">
    <var-app-bar class="app-bar" color="white" text-color="#333" title="收到的赞">
      <template #left>
        <var-button
          round
          text
          color="transparent"
          text-color="#333"
          @click="this.$router.return('/message')"
        >
          <var-icon name="chevron-left" :size="24"/>
        </var-button>
      </template>
    </var-app-bar>

    <div class="container">
      <var-list
        :finished="finished"
        v-model:loading="loading"
        @load="load"
        :immediate-check="false"
      >
        <div :key="like" v-for="like in like_list">
          <div class="cursor" v-if="like.recent">最新</div>
          <div class="cursor" v-if="like.old">累计</div>
          <div>

            <div v-if="like.origin===0">
              <transition :name="animation(like)" appear>

                <div class="like-wrap" @click="this.$router.push(`/bbs/article/${like.content.id}`)">
                  <img class="avatar" :src="this.$settings.cos_url+like.sender.icon"/>
                  <div class="info">
                    <div class="username">{{like.sender.username}}<span
                      class="tip">等{{like.new||like.total}}人赞了我的文章</span></div>
                    <div class="time">{{this.$calc.filters.date(like.time)}}</div>
                  </div>

                  <div class="article">{{this.$calc.filters.max_width(like.content.title,20)}}</div>
                </div>
              </transition>
            </div>

            <div v-if="like.origin===1">
              <transition :name="animation(like)" appear>
                <div class="like-wrap" @click="this.$router.push(`/bbs/article/${like.content.article.id}`)">
                  <img class="avatar" :src="this.$settings.cos_url+like.sender.icon"/>
                  <div class="info">
                    <div class="username">{{like.sender.username}}<span
                      class="tip">等{{like.new||like.total}}人赞了我的评论</span></div>
                    <div class="time">{{this.$calc.filters.date(like.time)}}</div>
                  </div>
                  <div class="comment break" v-html="like.content.description"/>
                </div>
              </transition>
            </div>

            <div v-if="like.origin===2">
              <transition :name="animation(like)" appear>

                <div class="like-wrap" @click="this.$router.push(`/special/column/${like.content.id}`)">
                  <img class="avatar" :src="this.$settings.cos_url+like.sender.icon"/>
                  <div class="info">
                    <div class="username">{{like.sender.username}}<span
                      class="tip">等{{like.new||like.total}}人赞了我的专栏</span></div>
                    <div class="time">{{this.$calc.filters.date(like.time)}}</div>
                  </div>

                  <div class="article">{{this.$calc.filters.max_width(like.content.title,20)}}</div>
                </div>
              </transition>
            </div>

            <div v-if="like.origin===3">
              <transition :name="animation(like)" appear>
                <div class="like-wrap" @click="this.$router.push(`/special/column/${like.content.column.id}`)">
                  <img class="avatar" :src="this.$settings.cos_url+like.sender.icon"/>
                  <div class="info">
                    <div class="username">{{like.sender.username}}<span
                      class="tip">等{{like.new||like.total}}人赞了我的评论</span></div>
                    <div class="time">{{this.$calc.filters.date(like.time)}}</div>
                  </div>
                  <div class="comment break" v-html="like.content.description"/>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </var-list>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Like",
    data() {
      return {
        like_list: [],
        finished: false,
        loading: true,
        next: null,
        before: null,
        current: 0
      }
    },
    methods: {
      animation(like) {
        if (!like.is_viewed) return "slide-fade"
        return "bloom"
      },
      load() {
        this.$request.api.get(
          this.next || `/message/like`
        ).then(res => {
          if (res.data.code === 140) {
            let data = res.data.result.results
            for (let i = 0; i < data.length; i++) {
              if (this.current === 0 && !data[i].is_viewed) {
                data[i].recent = true
              }
              if (this.current !== 0 && this.before !== data[i].is_viewed) {
                data[i].old = true
              }
              this.like_list.push(data[i])
              this.before = data[i].is_viewed
              this.current++
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
    },
    created() {
      this.load()
      if (this.$store.state.message) {
        this.$store.state.message.like = 0
      } else {
        this.$request.api.get(
          "user/self/message/"
        ).then(res => {
          this.$store.commit("message", res.data.result)
        })
      }
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

  .container {
    padding-top: 54px;
    min-height: 120vh;
  }

  .like-wrap {
    padding: 12px 5px;
    display: flex;
    justify-content: space-between;
    background-color: white;
    align-items: center;
    border-bottom: 1px solid #eee;
  }

  .avatar {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    border-radius: 50%;
  }

  .username {
    font-weight: bold;
    line-height: 20px;
    font-size: 14px;
  }

  .tip {
    margin-left: 5px;
    font-weight: normal;
  }

  .time {
    font-size: 14px;
    line-height: 15px;
    margin-top: 5px;
    color: #888;
  }

  .info {
    flex-grow: 1;
  }

  .article {
    width: 120px;
    padding: 10px;
    font-size: 14px;
    background-color: #f6f6f6;
    align-self: flex-start;
  }

  .comment {
    width: 120px;
    padding: 10px;
    font-size: 14px;
    align-self: flex-start;
    color: #444;
  }

  .cursor {
    font-size: 12px;
    padding: 3px;
    margin-top: 5px;
  }
</style>
