<template>
  <div class="animation-wrap">
    <var-app-bar class="app-bar var-elevation--2" color="white" :elevation="false" text-color="#333" title="黑名单">
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

    <div style="margin-top: 54px">
      <div class="search">
        <var-input class="search-input" placeholder="搜索" :hint="false" :line="false" v-model="search" @input="filter">
          <template #prepend-icon>
            <var-icon @click="filter" name="magnify-plus-outline"/>
          </template>
        </var-input>
        <div class="total">
          共{{total}}人
        </div>
        <var-divider margin="0"/>

        <div class="back">
          <var-list
            :finished="finished"
            v-model:loading="loading"
            @load="load"
          >
            <div :key="item" v-for="item in list">
              <div class="container">
                <img class="avatar" :src="this.$settings.cos_url+item.icon"
                     @click="this.$router.push(`/user/${item.id}`)"/>
                <div class="name">{{item.username}}</div>
                <div class="button">
                  <var-button v-if="item.not_blacked" class="right btn" type="warning" size="small"
                              @click="black(item)">
                    拉黑
                  </var-button>
                  <var-button v-else class="right btn" type="success" size="small" @click="not_black(item)">
                    取消拉黑
                  </var-button>
                </div>
              </div>
              <var-divider margin="0"/>
            </div>
          </var-list>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "BlackList",
    data() {
      return {
        search: "",
        list: [],
        finished: false,
        loading: false,
        next: null,
        total: 0
      }
    },
    methods: {
      filter() {
        this.list = []
        this.finished = false
        this.load()
      },
      load() {
        this.$request.api.get(
          this.next || `/user/black_list/?name=${this.search}`
        ).then(res => {
          if (res.data.code === 134) {
            this.total = res.data.result["count"]
            for (let i of res.data.result.results) {
              this.list.push({
                ...i.blacked,
                create_time: i.create_time
              })
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
      },
      black(user) {
        this.$tools.black(this.$request, user, this.$tip)
      },
      not_black(user) {
        this.$tools.not_black(this.$request, user, this.$tip, this.$dialog)
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

  .back {
    background-color: white;
    min-height: calc(100vh - 54px);
  }

  .search {
    padding: 8px 10px;
    background-color: white;
    border-bottom: 1px solid #eee;
  }

  .search-input {
    background-color: #f6f6f6;
    padding: 0 10px;
    border-radius: 15px;
  }

  .container {
    display: flex;
    padding: 10px;
  }

  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .total {
    line-height: 20px;
    margin-left: 10px;
    font-size: 12px;
    color: #777777;
  }

  .name {
    line-height: 60px;
    font-weight: bolder;
    color: #666666;
    width: calc(100vw - 180px);
  }

  .button {
    width: 100px;
    padding: 16px;
  }

  .btn {
    width: 80px;
  }
</style>