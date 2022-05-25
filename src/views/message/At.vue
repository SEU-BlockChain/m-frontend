<template>
  <div class="animation-wrap">
    <var-app-bar class="app-bar" color="white" text-color="#333" title="@我">
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
        <div :key="at" v-for="at in at_list">
          <div v-if="remove.indexOf(at.id)===-1">
            <div v-if="at.origin===0">
              <transition :name="animation(at)" appear>
                <div v-ripple="{ color: '#ccc' }" class="wrap"
                     @click="this.$router.push(`/bbs/article/${at.content.id}`)">
                  <img
                    class="avatar"
                    :src="this.$settings.cos_url+at.content.author.icon"
                    @click.stop="this.$router.push(`/user/${at.content.author.id}`)"
                  />
                  <div class="content">
                    <div class="head">
                      <div>
                        <span class="username">{{at.content.author.username}}</span>
                        <span class="tip">在文章中@了你</span>
                      </div>
                      <img
                        class="delete"
                        @click.stop="delete_at(at)"
                        src="~assets/img/delete.svg"
                        height="16"
                        alt="">
                    </div>
                    <div class="time">{{this.$calc.filters.date(at.time)}}</div>
                    <div class="article">{{at.content.title}}</div>
                  </div>
                </div>
              </transition>
            </div>
            <div v-if="at.origin===1">
              <transition :name="animation(at)" appear>
                <div v-ripple="{ color: '#ccc' }" class="wrap"
                     @click="this.$router.push(`/bbs/article/${at.content.article.id}`)">
                  <img
                    class="avatar"
                    :src="this.$settings.cos_url+at.content.author.icon"
                    @click.stop="this.$router.push(`/user/${at.content.author.id}`)"
                  />
                  <div class="content">
                    <div class="head">
                      <div>
                        <span class="username">{{at.content.author.username}}</span>
                        <span class="tip">在评论中@了你</span>
                      </div>
                      <img
                        class="delete"
                        @click.stop="delete_at(at)"
                        src="~assets/img/delete.svg"
                        height="16"
                        alt="">
                    </div>
                    <div class="time">{{this.$calc.filters.date(at.time)}}</div>
                    <div class="description" v-html="this.$xss(at.content.description)"/>
                    <div class="article">{{at.content.article.title}}</div>
                  </div>
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
    name: "At",
    data() {
      return {
        at_list: [],
        finished: false,
        loading: true,
        next: null,
        remove: []
      }
    },
    methods: {
      animation(like) {
        if (!like.is_viewed) return "slide-fade"
        return "bloom"
      },
      delete_at(at) {
        this.$dialog("是否删除记录").then(res => {
          if (res !== "confirm") return;
          this.$request.api.delete(
            `message/at/${at.id}/`,
          ).then(res => {
            if (res.data.code === 144) {
              this.$tip({
                content: "已删除记录",
                type: "success",
                duration: 1000,
              })
              this.remove.push(at.id)
            } else {
              this.$tip({
                content: res.data.msg,
                type: "warning",
                duration: 1000,
              })
            }
          })
        })
      },
      load() {
        this.$request.api.get(
          this.next || `/message/at`
        ).then(res => {
          if (res.data.code === 143) {
            for (let i of res.data.result.results) {
              this.at_list.push(i)
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
      }
    },
    created() {
      this.load()
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
    background-color: white;
  }

  .wrap {
    display: flex;
    justify-content: space-between;
    background-color: white;
    align-items: flex-start;
    padding: 10px;
    border-bottom: 1px solid #f0f1f5;
    flex-grow: 1;
  }

  .avatar {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    border-radius: 50%;
  }

  .username {
    font-size: 14px;
    font-weight: bolder;
    margin-right: 5px;
  }


  .tip {
    font-size: 14px;
    color: #666666;
  }

  .time {
    line-height: 20px;
    font-size: 12px;
    color: #666666;
  }

  .content {
    flex-grow: 1;
  }

  .article {
    font-size: 12px;
    margin: 10px 10px 0 0;
    color: black;
    padding: 10px;
    border-radius: 5px;
    align-self: flex-start;
    background-color: #f6f6f6;
  }

  .description {
    font-size: 14px;
    padding: 5px;
    color: #666666;
  }

  .head {
    display: flex;
    justify-content: space-between;
    padding-right: 10px;
  }

</style>