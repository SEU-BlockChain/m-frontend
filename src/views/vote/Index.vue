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
        <div class="head-text">投票</div>
      </template>
    </var-app-bar>

    <div style="height: 54px;"/>

    <div class="wrap">
      <var-pull-refresh v-model="refreshing" @refresh="refresh" success-duration="1000">
        <var-list
          :finished="finished"
          v-model:loading="loading"
          @load="load"
        >
          <div v-for="vote in vote_list">
            <transition name="bloom" appear>
              <div>
                <vote-card :vote="vote"/>
                <var-divider margin="0"/>
              </div>
            </transition>
          </div>
        </var-list>
      </var-pull-refresh>
    </div>


    <var-button class="create-vote" type="success" round @click="show=true">
      <var-icon size="28" name="plus"/>
    </var-button>

    <var-popup v-model:show="show" style="border-radius: 10px">
      <div class="create">
        <a-input placeholder="题目" allow-clear v-model="new_vote.title"/>
        <div style="height: 10px"></div>
        <a-input-tag v-model="new_vote.choice_list" placeholder="输入选项按回车确定" size="large"/>
        <div style="height: 10px"></div>
        <a-input placeholder="开始时间" v-model="new_vote.start_time"/>
        <div style="height: 10px"></div>
        <a-input placeholder="截止时间" v-model="new_vote.end_time"/>
        <div style="height: 10px"></div>
        <a-input placeholder="最多选择" v-model="new_vote.max_num"/>
        <div style="height: 10px"></div>
        <a-input placeholder="最少选择" v-model="new_vote.min_num"/>
        <div style="height: 10px"></div>
        <a-checkbox v-model="new_vote.need_vote">投票后才能查看投票情况</a-checkbox>
        <div style="height: 20px"></div>
        <var-button block text outline type="primary" size="small" @click="create">创建投票</var-button>
      </div>
    </var-popup>
  </div>
</template>

<script>
  import VoteCard from "../../components/card/VoteCard";

  export default {
    name: "Index",
    components: {VoteCard},
    data() {
      return {
        refreshing: false,
        vote_list: [],
        finished: false,
        loading: false,
        next: null,
        show: false,
        new_vote: {
          title: null,
          choice_list: [],
          need_vote: false,
          anonymous: false,
          start_time: null,
          end_time: null,
          max_num:null,
          min_num:null,
        }
      }
    },
    methods: {
      create() {
        this.$request.api.post(
          `/vote/`,
          this.new_vote
        ).then(res => {
          if (res.data.code === 172) {
            this.$router.push(`/vote/${res.data.result.id}`)
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
        })
      },
      load() {
        this.$request.api.get(
          this.next || `/vote/`,
        ).then(res => {
          if (res.data.code === 174) {
            for (let i of res.data.result.results) {
              this.vote_list.push(i)
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
        this.vote_list = []
        this.finished = false
        this.loading = true
        this.next = null
        this.load()
      }
    }
  }
</script>

<style scoped>
  .create {
    width: 80vw;
    padding: 20px 10px;
  }

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
    text-align: center;
  }

  .wrap {
    padding: 3px;
  }

  .create-vote {
    position: fixed;
    right: 15px;
    bottom: 120px;
  }
</style>

<style>
  .arco-trigger-popup {
    z-index: 20000 !important;
  }
</style>